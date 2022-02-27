const iso8601toDisplayStr = (iso8601: string | undefined) => {
  if (iso8601 === undefined) {
    return ''
  }
  // 実行環境のタイムゾーンに関わらず、日本時間の値を取り出す
  // build 環境はCI上でアメリカ時間と予想されるため
  const date = new Date(iso8601)
  const timezoneoffset = -9 // UTC-表示したいタイムゾーン(単位:hour)。JSTなら-9
  const fakeUTC = new Date(date.getTime() - (timezoneoffset * 60 - new Date().getTimezoneOffset()) * 60000)
  const yyyy = '' + fakeUTC.getFullYear()
  const MM = ('00' + (fakeUTC.getMonth() + 1)).slice(-2)
  const dd = ('00' + fakeUTC.getDate()).slice(-2)
  const hh = ('00' + fakeUTC.getHours()).slice(-2)
  const mm = ('00' + fakeUTC.getMinutes()).slice(-2)
  return `${yyyy}-${MM}-${dd} ${hh}:${mm}`
}

export { iso8601toDisplayStr }
