---
title: "androidの架電アプリによる各種制御プログラムの起動"
date: "2020-03-28T02:45:25+09:00"
tags: [ "android" ]
---

## まえがき

PC内のデータを整理していたら過去に自分向けに書いていたメモが出てきたので、ここ記す形で移動する。
タイムスタンプをみるに、2017/11/22頃に書かれたものだ。

androidでは、端末の細かい挙動の設定を変更する際、電話アプリで以下に有るようなコマンドを打ち込むと行えることがある。

過去のメモなので、どの機種、環境だと利用できるのか確認していないが、少なくとも SOL26で利用できそうである。

## メモ

```
Open Android Mobile Programs Using Commend  
 
 Commands               Usages 
 
*#06# = IMEI Android serial number 
 
*#8999*523# = LCD Brightness 
*#1234# = To check Software and Hardware information, PDA, CSC,MODEM. 
 
*#2222# = it will open H/W Version 
*#*#4636#*#*= user statistics and Phone Info 
*#0011# = Displays status information for the GSM 
*2767*3855# = Full factory reset (Don’t dial unless you have problem, it does not ask you to confirm) 
*#12580*369# = SW & HW Info 
#*#8377466# = S/W Version & H/W Version 
#*5376# = DELETE ALL SMS!!!! 
*#197328640# = Service Mode 
*#0228# = Battery status (ADC, RSSI reading) 
*#32489# = Service mode (Ciphering Info) 
*#2255# = Call List 
#*3888# = BLUETOOTH Test mode 
#*7828# = Task screen 
*#5282837# = Java Version 
*#232331# = Bluetooth Test Mode 
*#232338# = WLAN MAC Address 
*#232339# = WLAN Test Mode 
*#8999*8378# = Test Menu 
*#0842# = Vibrate Motor Test Mode 
*#0782# = Real Time Clock Test 
*#0673# = Audio Test Mode 
*#0*# = General Test Mode 
*#2263# = RF Band Selection / Network modes select 
*#9090# = Diagnostic Configuration 
*#7284# = USB I2C Mode Control 
*#872564# = USB Logging Control 
*#4238378# = GCF Configuration 
*#0283# = Audio Loopback Control 
*#1575# = GPS Control Menu 
*#3214789650# = LBS Test Mode 
*#745# = RIL Dump Menu 
*#746# = Debug Dump Menu 
*#9900# = Takes you to System Dump, where Disabling Fast Dormancy gives a boost to your network speed on some networks (both Wi-Fi and Gpr), same code to re-enable it 
*#44336# = Software Version Info 
*#0289# = Melody Test Mode 
*#2663# = TSP / TSK firmware update 
*#03# = NAND Flash S/N 
*#0589# = Light Sensor Test Mode 
*#0588# = Proximity Sensor Test Mode 
*#273283*255*3282*# = Data Create Menu 
 
*#7594# = Remap Shutdown to End Call TSK 
*#7465625# = View Phone Lock Status 
*7465625*638*# = Configure Network Lock MCC/MNC 
#7465625*638*# = Insert Network Lock Key code 
*7465625*782*# = Configure Network Lock NSP 
#7465625*782*# = Insert Partial Network Lock key code 
*7465625*77*# = Insert Network Lock key code SP 
#7465625*77*# = Insert Operator Lock key code 
*7465625*27*# = Insert Network Lock key code NSP/CP 
#7465625*27*# = Insert Content Provider key code 
*#272*IMEI# = then we will get buyer code (For Samsung galaxy six code) 
*#*#7780#*#* = Factory data reset – Clears Google-account data, system and program settings and 
 
*2767*3855# = Format phone 
 
The Most Useful Cods on Android Mobile 
– Disables Network Lock : #7465625*638*00000000# 
– Disables SIM Lock : #7465625*746*00000000# 
– Disables SP lock : #7465625*77*00000000# 
– Disables Subset Lock : #7465625*782*00000000# 
``` 

参考: http://www.commandshow.com/open-android-programs-using-command/ 
