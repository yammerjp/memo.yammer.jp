import { spawn } from 'child_process'

export interface ExecResult {
  stdout: string
  stderr: string
}

export interface ExecOptions {
  timeout?: number
  cwd?: string
  env?: NodeJS.ProcessEnv
}

/**
 * 安全にコマンドを実行するヘルパー関数
 * child_process.spawnを使用してシェルインジェクションを防ぐ
 */
export function safeExec(
  command: string,
  args: string[],
  options: ExecOptions = {}
): Promise<ExecResult> {
  return new Promise((resolve, reject) => {
    const { timeout = 30000, cwd, env } = options
    
    // コマンドとパスの検証
    if (!command || command.includes('..')) {
      reject(new Error('Invalid command'))
      return
    }
    
    // 引数の検証（シェルメタ文字をチェック）
    const dangerousChars = /[;&|`()<>]/  // $は環境変数のために許可
    for (const arg of args) {
      if (dangerousChars.test(arg)) {
        reject(new Error(`Dangerous character in argument: ${arg}`))
        return
      }
    }
    
    const child = spawn(command, args, {
      cwd,
      env: env || process.env,
      shell: false, // シェルを使わない
    })
    
    let stdout = ''
    let stderr = ''
    let timedOut = false
    
    // タイムアウト処理
    const timer = setTimeout(() => {
      timedOut = true
      child.kill('SIGKILL')
    }, timeout)
    
    child.stdout.on('data', (data) => {
      stdout += data.toString()
    })
    
    child.stderr.on('data', (data) => {
      stderr += data.toString()
    })
    
    child.on('error', (error) => {
      clearTimeout(timer)
      reject(error)
    })
    
    child.on('close', (code) => {
      clearTimeout(timer)
      
      if (timedOut) {
        reject(new Error(`Command timed out after ${timeout}ms`))
        return
      }
      
      if (code !== 0) {
        reject(new Error(`Command failed with code ${code}: ${stderr}`))
        return
      }
      
      resolve({ stdout, stderr })
    })
  })
}

/**
 * ファイルパスをサニタイズする
 * 相対パスやシェルメタ文字を除去
 */
export function sanitizePath(path: string): string {
  // 相対パス要素を除去
  if (path.includes('..')) {
    throw new Error('Path traversal detected')
  }
  
  // Null文字をチェック
  if (path.includes('\0')) {
    throw new Error('Invalid characters in path')
  }
  
  // シェルメタ文字をエスケープ
  // Git操作で必要な文字は許可（英数字、スラッシュ、ハイフン、ドット、アンダースコア）
  const allowedPattern = /^[a-zA-Z0-9\-_./]+$/
  if (!allowedPattern.test(path)) {
    throw new Error('Invalid characters in path')
  }
  
  return path
}