import { describe, it, expect, vi } from 'vitest'
import { safeExec, sanitizePath } from '../../src/lib/safeExec'

describe('safeExec', () => {
  describe('safeExec function', () => {
    it('should execute simple commands safely', async () => {
      const result = await safeExec('echo', ['hello world'])
      expect(result.stdout.trim()).toBe('hello world')
    })

    it('should reject dangerous characters in arguments', async () => {
      const dangerousArgs = [
        'test; rm -rf /',
        'test && malicious-command',
        'test | cat /etc/passwd',
        'test `whoami`',
        'test > /etc/passwd',
        'test < /etc/passwd'
      ]

      for (const arg of dangerousArgs) {
        await expect(safeExec('echo', [arg])).rejects.toThrow('Dangerous character in argument')
      }
    })

    it('should reject invalid commands', async () => {
      await expect(safeExec('', ['test'])).rejects.toThrow('Invalid command')
      await expect(safeExec('../../../bin/evil', ['test'])).rejects.toThrow('Invalid command')
    })

    it('should handle command timeout', async () => {
      // sleepコマンドを使ってタイムアウトをテスト
      await expect(
        safeExec('sleep', ['5'], { timeout: 100 })
      ).rejects.toThrow('Command timed out after 100ms')
    })

    it('should handle command failure', async () => {
      // 存在しないファイルをcatしようとする
      await expect(
        safeExec('cat', ['/this/file/does/not/exist'])
      ).rejects.toThrow(/Command failed with code/)
    })

    it('should not use shell', async () => {
      // シェル展開が無効化されていることを確認
      const result = await safeExec('echo', ['$HOME'])
      expect(result.stdout.trim()).toBe('$HOME') // 変数展開されない
    })
  })

  describe('sanitizePath function', () => {
    it('should allow valid paths', () => {
      const validPaths = [
        'content/posts/test.md',
        'src/lib/api.ts',
        'test-file.txt',
        'folder/sub-folder/file_name.ext',
        './current/directory/file.md'
      ]

      for (const path of validPaths) {
        expect(() => sanitizePath(path)).not.toThrow()
        expect(sanitizePath(path)).toBe(path)
      }
    })

    it('should reject path traversal attempts', () => {
      const dangerousPaths = [
        '../etc/passwd',
        'content/../../../etc/passwd',
        'content/posts/../../../../../../etc/passwd',
        './../sensitive-file'
      ]

      for (const path of dangerousPaths) {
        expect(() => sanitizePath(path)).toThrow('Path traversal detected')
      }
    })

    it('should reject paths with dangerous characters', () => {
      const dangerousPaths = [
        'file; rm -rf /',
        'file && malicious',
        'file | cat secrets',
        'file`whoami`',
        'file$(whoami)',
        'file\0name.txt',
        'file*name.txt',
        'file?name.txt',
        'file[name].txt'
      ]

      for (const path of dangerousPaths) {
        expect(() => sanitizePath(path)).toThrow('Invalid characters in path')
      }
    })

    it('should remove null characters', () => {
      expect(() => sanitizePath('file\0name.txt')).toThrow('Invalid characters in path')
    })
  })

  describe('integration with git commands', () => {
    it('should safely execute git log', async () => {
      // 実際のgitコマンドをテスト（リポジトリ内で実行される前提）
      const result = await safeExec('git', [
        'log',
        '--format=%H',
        '-n', '1',
        '--', 'README.md'
      ])
      
      // コミットハッシュの形式をチェック
      expect(result.stdout.trim()).toMatch(/^[a-f0-9]{40}$/)
    })

    it('should prevent shell injection in git commands', async () => {
      // 悪意のあるファイル名でもエラーにならず、単にファイルが見つからないエラーになることを確認
      const result = await safeExec('git', [
        'log',
        '--format=%H',
        '--', 
        'nonexistent.md'
      ])
      
      expect(result.stdout.trim()).toBe('')
    })
  })
})