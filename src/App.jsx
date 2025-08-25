import React, { useState, useRef, useEffect } from 'react';
import { MapPin, DollarSign, Home, Key, TrendingUp, Eye, Star, Camera, Landmark, Info } from 'lucide-react';
import html2canvas from 'html2canvas';

// Rating ranks and their corresponding colors
const rankColors = {
  'SS': 'bg-green-500',
  'S': 'bg-blue-500',
  'A': 'bg-yellow-500',
  'B': 'bg-red-500',
};

// Data for station-based income (for demonstration)
const stationIncomeData = {
    "東京": 7630000, "有楽町": 7630000, "新橋": 7430000, "浜松町": 7410000, "田町": 7330000, "高輪ゲートウェイ": 6990000, "品川": 6710000, "大崎": 6310000, "五反田": 6390000, "目黒": 6510000, "恵比寿": 6650000, "渋谷": 6660000, "原宿": 6510000, "代々木": 5800000, "新宿": 5570000, "新大久保": 5330000, "高田馬場": 5260000, "目白": 5240000, "池袋": 5250000, "大塚": 5560000, "巣鴨": 5840000, "駒込": 5830000, "田端": 5690000, "西日暮里": 5750000, "日暮里": 5780000, "鶯谷": 5780000, "上野": 6030000, "御徒町": 6310000, "秋葉原": 6650000, "神田": 6950000, "赤羽": 5140000, "東十条": 5150000, "王子": 5180000, "上中里": 5420000, "大井町": 6130000, "大森": 5830000, "蒲田": 5570000, "御茶ノ水": 6900000, "水道橋": 6870000, "飯田橋": 6670000, "市ケ谷": 6260000, "四ツ谷": 6210000, "信濃町": 6320000, "千駄ケ谷": 5920000, "大久保": 5370000, "東中野": 5290000, "中野": 5300000, "高円寺": 5430000, "阿佐ケ谷": 5550000, "荻窪": 5740000, "西荻窪": 5870000, "吉祥寺": 5880000, "三鷹": 5870000, "武蔵境": 5770000, "東小金井": 5840000, "武蔵小金井": 5780000, "国分寺": 5570000, "西国分寺": 5720000, "国立": 5740000, "立川": 5180000, "日野": 5290000, "豊田": 5350000, "八王子": 4890000, "西八王子": 4930000, "高尾": 4940000, "小岩": 5310000, "新小岩": 5240000, "平井": 5550000, "亀戸": 5740000, "錦糸町": 5810000, "両国": 6160000, "浅草橋": 6280000, "三河島": 5550000, "南千住": 5430000, "北千住": 5110000, "綾瀬": 4930000, "亀有": 4970000, "金町": 5090000, "片倉": 4980000, "八王子みなみ野": 5110000, "相原": 5140000, "町田": 5280000, "成瀬": 5780000, "西大井": 6000000, "板橋": 5190000, "十条": 5160000, "北赤羽": 5130000, "浮間舟渡": 5180000, "矢野口": 5660000, "稲城長沼": 5820000, "南多摩": 5640000, "府中本町": 5420000, "分倍河原": 5460000, "西府": 5570000, "谷保": 5770000, "矢川": 5570000, "西国立": 5410000, "北府中": 5470000, "新小平": 5250000, "新秋津": 5220000, "尾久": 5510000, "越中島": 6820000, "潮見": 6030000, "葛西臨海公園": 5060000, "新日本橋": 6950000, "馬喰町": 6490000, "西立川": 5000000, "東中神": 5050000, "中神": 5010000, "昭島": 5090000, "拝島": 4880000, "牛浜": 4830000, "福生": 4900000, "羽村": 5130000, "小作": 5050000, "河辺": 4970000, "東青梅": 4930000, "青梅": 5090000, "宮ノ平": 5140000, "日向和田": 5160000, "石神前": 5160000, "二俣尾": 5180000, "軍畑": 5200000, "沢井": 5270000, "御嶽": 5180000, "川井": 4540000, "古里": 4260000, "鳩ノ巣": 4260000, "白丸": 4220000, "奥多摩": 4230000, "北八王子": 5160000, "小宮": 5190000, "東福生": 4850000, "箱根ケ崎": 5020000, "熊川": 4830000, "東秋留": 4910000, "秋川": 4960000, "武蔵引田": 4870000, "武蔵増戸": 4880000, "武蔵五日市": 5070000, "落合": 5260000, "早稲田": 5510000, "神楽坂": 6270000, "九段下": 7000000, "竹橋": 7370000, "大手町": 7450000, "日本橋": 7260000, "茅場町": 7090000, "門前仲町": 6660000, "木場": 6180000, "東陽町": 6020000, "南砂町": 6000000, "西葛西": 5230000, "葛西": 5210000, "地下鉄成増": 5310000, "地下鉄赤塚": 5260000, "平和台": 5450000, "氷川台": 5370000, "小竹向原": 5220000, "千川": 5150000, "要町": 5160000, "東池袋": 5430000, "護国寺": 5730000, "江戸川橋": 6140000, "麹町": 6490000, "永田町": 7090000, "桜田門": 7760000, "銀座一丁目": 7620000, "新富町": 7500000, "月島": 7150000, "豊洲": 6530000, "辰巳": 6030000, "新木場": 5660000, "新大塚": 5750000, "茗荷谷": 6080000, "後楽園": 6780000, "本郷三丁目": 6790000, "淡路町": 6910000, "銀座": 7610000, "霞ケ関": 7650000, "国会議事堂前": 7600000, "赤坂見附": 7020000, "四谷三丁目": 5850000, "新宿御苑前": 5570000, "新宿三丁目": 5540000, "西新宿": 5510000, "中野坂上": 5490000, "新中野": 5450000, "東高円寺": 5390000, "新高円寺": 5490000, "南阿佐ケ谷": 5610000, "中野新橋": 5560000, "中野富士見町": 5560000, "方南町": 5670000, "三ノ輪": 5450000, "入谷": 5660000, "仲御徒町": 6310000, "小伝馬町": 6720000, "人形町": 6740000, "八丁堀": 7360000, "築地": 7510000, "東銀座": 7610000, "日比谷": 7650000, "虎ノ門ヒルズ": 7390000, "神谷町": 7330000, "六本木": 7230000, "広尾": 7020000, "中目黒": 6490000, "北綾瀬": 4900000, "町屋": 5330000, "千駄木": 6030000, "根津": 6210000, "湯島": 6450000, "新御茶ノ水": 6980000, "二重橋前": 7730000, "赤坂": 7240000, "乃木坂": 7020000, "表参道": 6760000, "明治神宮前": 6620000, "代々木公園": 6470000, "代々木上原": 6180000, "赤羽岩淵": 5170000, "志茂": 5130000, "王子神谷": 5180000, "西ケ原": 5410000, "本駒込": 6220000, "東大前": 6540000, "溜池山王": 7480000, "六本木一丁目": 7390000, "麻布十番": 7280000, "白金高輪": 7060000, "白金台": 6710000, "浅草": 5660000, "田原町": 5830000, "稲荷町": 5980000, "上野広小路": 6380000, "末広町": 6560000, "三越前": 7140000, "京橋": 7610000, "虎ノ門": 7510000, "青山一丁目": 6760000, "外苑前": 6650000, "半蔵門": 6740000, "神保町": 7070000, "水天宮前": 6790000, "清澄白河": 6360000, "住吉": 5840000, "押上": 5660000, "雑司が谷": 5360000, "西早稲田": 5340000, "東新宿": 5380000, "北参道": 6070000, "天王洲アイル": 6600000, "大井競馬場前": 5960000, "流通センター": 5690000, "昭和島": 5470000, "整備場": 5560000, "天空橋": 5510000, "羽田空港第3ターミナル": 5440000, "泉岳寺": 7040000, "北品川": 6540000, "新馬場": 6330000, "青物横丁": 6210000, "鮫洲": 6100000, "立会川": 6010000, "大森海岸": 5830000, "平和島": 5690000, "大森町": 5590000, "梅屋敷": 5560000, "京急蒲田": 5550000, "雑色": 5530000, "六郷土手": 5450000, "糀谷": 5520000, "大鳥居": 5480000, "穴守稲荷": 5510000, "新宿西口": 5520000, "若松河田": 5550000, "牛込柳町": 5850000, "牛込神楽坂": 6240000, "春日": 6790000, "上野御徒町": 6340000, "新御徒町": 6130000, "蔵前": 6000000, "森下": 6220000, "勝どき": 7280000, "築地市場": 7600000, "汐留": 7480000, "大門": 7370000, "赤羽橋": 7310000, "国立競技場": 6000000, "都庁前": 5630000, "西新宿五丁目": 5620000, "中井": 5250000, "落合南長崎": 5260000, "新江古田": 5320000, "練馬": 5470000, "豊島園": 5560000, "練馬春日町": 5550000, "光が丘": 5580000, "三田": 7330000, "芝公園": 7330000, "御成門": 7350000, "内幸町": 7460000, "白山": 6310000, "千石": 6090000, "西巣鴨": 5360000, "新板橋": 5170000, "板橋区役所前": 5110000, "板橋本町": 5090000, "本蓮沼": 5090000, "志村坂上": 5050000, "志村三丁目": 5080000, "蓮根": 5030000, "西台": 5030000, "高島平": 4980000, "新高島平": 4910000, "西高島平": 4980000, "曙橋": 5800000, "小川町": 6960000, "岩本町": 6700000, "馬喰横山": 6490000, "浜町": 6430000, "菊川": 6030000, "西大島": 5850000, "大島": 5810000, "東大島": 5600000, "船堀": 5270000, "一之江": 5340000, "瑞江": 5310000, "篠崎": 5410000, "西馬込": 5780000, "馬込": 5940000, "中延": 6040000, "戸越": 6150000, "高輪台": 6640000, "宝町": 7590000, "東日本橋": 6410000, "本所吾妻橋": 5650000, "三ノ輪橋": 5420000, "荒川一中前": 5390000, "荒川区役所前": 5380000, "荒川二丁目": 5340000, "荒川七丁目": 5300000, "町屋前": 5270000, "町屋二丁目": 5320000, "東尾久三丁目": 5310000, "熊野前": 5350000, "宮ノ前": 5340000, "小台": 5260000, "荒川遊園地前": 5300000, "荒川車庫前": 5340000, "梶原": 5320000, "栄町": 5280000, "王子前": 5180000, "飛鳥山": 5220000, "滝野川一丁目": 5320000, "西ヶ原四丁目": 5360000, "新庚申塚": 5410000, "庚申塚": 5430000, "巣鴨新田": 5520000, "大塚前": 5620000, "向原": 5540000, "東池袋四丁目": 5510000, "都電雑司ヶ谷": 5430000, "鬼子母神前": 5350000, "学習院下": 5360000, "面影橋": 5420000, "赤土小学校前": 5460000, "足立小台": 5170000, "扇大橋": 4990000, "高野": 4900000, "江北": 4910000, "西新井大師西": 4870000, "谷在家": 4840000, "舎人公園": 4890000, "舎人": 5110000, "見沼代親水公園": 5210000, "初台": 5890000, "幡ヶ谷": 5920000, "笹塚": 6030000, "代田橋": 6060000, "明大前": 6060000, "下高井戸": 6130000, "桜上水": 6140000, "上北沢": 6180000, "八幡山": 6180000, "芦花公園": 6210000, "千歳烏山": 6150000, "仙川": 5900000, "つつじヶ丘": 5600000, "柴崎": 5500000, "国領": 5510000, "布田": 5550000, "調布": 5610000, "西調布": 5670000, "飛田給": 5620000, "武蔵野台": 5560000, "多磨霊園": 5540000, "東府中": 5510000, "府中": 5440000, "中河原": 5450000, "聖蹟桜ヶ丘": 5400000, "百草園": 5290000, "高幡不動": 5440000, "南平": 5400000, "平山城址公園": 5320000, "長沼": 5240000, "北野": 5090000, "京王八王子": 4900000, "神泉": 6580000, "駒場東大前": 6460000, "池ノ上": 6340000, "下北沢": 6260000, "新代田": 6220000, "東松原": 6200000, "永福町": 5930000, "西永福": 5950000, "浜田山": 5920000, "高井戸": 5970000, "富士見ヶ丘": 5940000, "久我山": 5910000, "三鷹台": 5890000, "井の頭公園": 5880000, "京王多摩川": 5610000, "京王よみうりランド": 5840000, "稲城": 6010000, "京王永山": 5370000, "京王多摩センター": 5180000, "京王堀之内": 4860000, "南大沢": 5050000, "多摩境": 5150000, "京王片倉": 4930000, "山田": 5000000, "めじろ台": 5020000, "狭間": 4990000, "高尾山口": 4980000, "多摩動物公園": 5160000, "府中競馬正門前": 5440000, "南新宿": 5850000, "参宮橋": 6040000, "代々木八幡": 6420000, "東北沢": 6250000, "世田谷代田": 6290000, "梅ヶ丘": 6350000, "豪徳寺": 6380000, "経堂": 6480000, "千歳船橋": 6540000, "祖師ヶ谷大蔵": 6620000, "成城学園前": 6450000, "喜多見": 5910000, "狛江": 5540000, "和泉多摩川": 5460000, "鶴川": 5890000, "玉川学園前": 5670000, "小田急永山": 5410000, "小田急多摩センター": 5180000, "唐木田": 5170000, "椎名町": 5200000, "東長崎": 5220000, "江古田": 5320000, "桜台": 5430000, "中村橋": 5550000, "富士見台": 5590000, "練馬高野台": 5690000, "石神井公園": 5780000, "大泉学園": 5870000, "保谷": 5700000, "ひばりヶ丘": 5410000, "東久留米": 5310000, "清瀬": 5230000, "秋津": 5210000, "西武新宿": 5460000, "下落合": 5250000, "新井薬師前": 5290000, "沼袋": 5330000, "野方": 5370000, "都立家政": 5440000, "鷺ノ宮": 5490000, "下井草": 5600000, "井荻": 5700000, "上井草": 5740000, "上石神井": 5850000, "武蔵関": 5850000, "東伏見": 5750000, "西武柳沢": 5630000, "田無": 5610000, "花小金井": 5540000, "小平": 5250000, "久米川": 5140000, "東村山": 5160000, "萩山": 5110000, "小川": 5120000, "東大和市": 5190000, "玉川上水": 5010000, "武蔵砂川": 4870000, "西武立川": 5040000, "新桜台": 5370000, "一橋学園": 5460000, "青梅街道": 5230000, "八坂": 5080000, "武蔵大和": 5170000, "多摩湖": 5280000, "新小金井": 5830000, "多磨": 5630000, "白糸台": 5570000, "競艇場前": 5600000, "是政": 5530000, "恋ヶ窪": 5660000, "鷹の台": 5580000, "西武園": 5280000, "北池袋": 5180000, "下板橋": 5130000, "大山": 5080000, "中板橋": 5070000, "ときわ台": 5090000, "上板橋": 5160000, "東武練馬": 5170000, "下赤塚": 5260000, "成増": 5310000, "とうきょうスカイツリー": 5650000, "曳舟": 5580000, "東向島": 5540000, "鐘ヶ淵": 5410000, "堀切": 5200000, "牛田": 5180000, "小菅": 5000000, "五反野": 4940000, "梅島": 4910000, "西新井": 4920000, "竹ノ塚": 4850000, "大師前": 4890000, "小村井": 5620000, "東あずま": 5620000, "亀戸水神": 5660000, "竹芝": 7470000, "日の出": 7400000, "芝浦ふ頭": 7320000, "お台場海浜公園": 6720000, "台場": 6270000, "東京国際クルーズターミナル": 6270000, "テレコムセンター": 5980000, "青海": 6570000, "東京ビッグサイト": 6150000, "有明": 6170000, "有明テニスの森": 6660000, "市場前": 6980000, "新豊洲": 6820000, "東雲": 6070000, "国際展示場": 6250000, "東京テレポート": 6720000, "品川シーサイド": 6250000, "代官山": 6600000, "祐天寺": 6520000, "学芸大学": 6460000, "都立大学": 6480000, "自由が丘": 6470000, "田園調布": 6250000, "多摩川": 6230000, "池尻大橋": 6510000, "三軒茶屋": 6490000, "駒沢大学": 6560000, "桜新町": 6690000, "用賀": 6740000, "二子玉川": 6360000, "つくし野": 5820000, "すずかけ台": 5700000, "南町田グランベリーパーク": 5670000, "大崎広小路": 6340000, "戸越銀座": 6170000, "荏原中延": 6090000, "旗の台": 6020000, "長原": 6020000, "洗足池": 6010000, "石川台": 6030000, "雪が谷大塚": 6020000, "御嶽山": 5950000, "久が原": 5910000, "千鳥町": 5750000, "池上": 5680000, "蓮沼": 5620000, "下神明": 6130000, "戸越公園": 6070000, "荏原町": 6010000, "北千束": 6120000, "大岡山": 6210000, "緑が丘": 6270000, "九品仏": 6610000, "尾山台": 6680000, "等々力": 6680000, "上野毛": 6540000, "不動前": 6350000, "武蔵小山": 6230000, "西小山": 6180000, "洗足": 6170000, "奥沢": 6340000, "沼部": 6120000, "鵜の木": 6010000, "下丸子": 5850000, "武蔵新田": 5770000, "矢口渡": 5730000, "西太子堂": 6480000, "若林": 6470000, "松陰神社前": 6500000, "世田谷": 6520000, "上町": 6540000, "宮の坂": 6510000, "山下": 6390000, "松原": 6240000, "京成上野": 6230000, "新三河島": 5570000, "京成町屋": 5280000, "千住大橋": 5260000, "京成関屋": 5180000, "堀切菖蒲園": 5080000, "お花茶屋": 5040000, "青砥": 5090000, "京成高砂": 5130000, "京成小岩": 5280000, "江戸川": 5400000, "京成曳舟": 5570000, "八広": 5420000, "四ツ木": 5330000, "京成立石": 5120000, "柴又": 5160000, "京成金町": 5090000, "青井": 4910000, "六町": 4900000, "多摩センター": 5120000, "松が谷": 5150000, "大塚・帝京大学": 5060000, "中央大学・明星大学": 5110000, "程久保": 5250000, "万願寺": 5500000, "甲州街道": 5270000, "柴崎体育館": 5170000, "立川南": 5180000, "立川北": 5160000, "高松": 5000000, "立飛": 5000000, "泉体育館": 5180000, "砂川七番": 5170000, "桜街道": 4930000, "上北台": 5030000, "新柴又": 5220000
};

// Ranking criteria for each item
const rankingCriteria = {
  interior: { '優': 5, '良': 4, '可': 3, '否': 2 },
  location: { '優': 5, '良': 4, '可': 3, '否': 2 },
  visibility: { '優': 5, '良': 4, '可': 3, '否': 2 },
  signage: { '可': 4, '否': 2 },
  walkToStation: (val) => {
    const minutes = parseInt(val, 10);
    if (isNaN(minutes)) return 0;
    if (minutes >= 1 && minutes <= 3) return 5;
    if (minutes >= 4 && minutes <= 5) return 4;
    if (minutes >= 6 && minutes <= 7) return 3;
    return 2;
  },
  rent: (val) => {
    const rent = parseInt(val, 10);
    if (isNaN(rent)) return 0;
    if (rent <= 150000) return 5;
    if (rent <= 200000) return 4;
    if (rent <= 250000) return 3;
    return 2;
  },
  initialCost: (val) => {
    const cost = parseInt(val, 10);
    if (isNaN(cost)) return 0;
    if (cost <= 1200000) return 5;
    if (cost <= 1500000) return 4;
    if (cost <= 1800000) return 3;
    return 2;
  },
  floor: (val) => {
    const floor = parseInt(val, 10);
    if (isNaN(floor)) return 0;
    if (floor >= 3) return 5;
    if (floor === 2) return 3;
    return 2;
  },
  income: (val) => {
    const income = parseInt(val, 10);
    if (isNaN(income)) return 0;
    if (income >= 6000000) return 5;
    if (income >= 5500000) return 4;
    if (income >= 5000000) return 3;
    return 2;
  },
  household1km: (val) => {
    const count = parseInt(val, 10);
    if (isNaN(count)) return 0;
    if (count >= 35000) return 5;
    if (count >= 25000) return 4;
    if (count >= 15000) return 3;
    return 2;
  },
  household1_5km: (val) => {
    const count = parseInt(val, 10);
    if (isNaN(count)) return 0;
    if (count >= 35000) return 5;
    if (count >= 25000) return 4;
    if (count >= 15000) return 3;
    return 2;
  },
};

// Map points to ranks
const pointToRank = {
  5: 'SS',
  4: 'S',
  3: 'A',
  2: 'B',
  0: '-',
};

// Function to calculate overall rank
const getRankFromPoints = (points) => {
  if (points >= 4.5) return 'SS';
  if (points >= 3.5) return 'S';
  if (points >= 2.5) return 'A';
  return 'B';
};

export default function App() {
  const [images, setImages] = useState([]);
  const [reportImages, setReportImages] = useState([]); // レポート用画像を独立管理
  const [imageCount, setImageCount] = useState(0);
  const [address, setAddress] = useState('');
  const [nearestStation, setNearestStation] = useState('');
  const [interior, setInterior] = useState('');
  const [signage, setSignage] = useState('');
  const [walkToStation, setWalkToStation] = useState('');
  const [rent, setRent] = useState('');
  const [initialCost, setInitialCost] = useState('');
  const [floor, setFloor] = useState('');
  const [location, setLocation] = useState('');
  const [visibility, setVisibility] = useState('');
  const [stationIncome, setStationIncome] = useState(null);
  const [household1km, setHousehold1km] = useState('');
  const [household1_5km, setHousehold1_5km] = useState('');
  const [overallRank, setOverallRank] = useState('N/A');
  const [isProcessing, setIsProcessing] = useState(false);
  const captureRef = useRef(null);
  
  // State for individual item ranks to be displayed in the report
  const [itemRanks, setItemRanks] = useState({
    walkToStation: '-', rent: '-', initialCost: '-', floor: '-',
    interior: '-', location: '-', visibility: '-', signage: '-', stationIncome: '-',
    household1km: '-', household1_5km: '-',
  });

  // Function to calculate and update ranks
  const calculateRanks = () => {
    const points = {
      interior: interior ? rankingCriteria.interior[interior] : 0,
      signage: signage ? rankingCriteria.signage[signage] : 0,
      walkToStation: rankingCriteria.walkToStation(walkToStation),
      rent: rankingCriteria.rent(rent),
      initialCost: rankingCriteria.initialCost(initialCost),
      floor: rankingCriteria.floor(floor),
      location: location ? rankingCriteria.location[location] : 0,
      visibility: visibility ? rankingCriteria.visibility[visibility] : 0,
      stationIncome: stationIncome ? rankingCriteria.income(stationIncome) : 0,
      household1km: rankingCriteria.household1km(household1km),
      household1_5km: rankingCriteria.household1_5km(household1_5km),
    };

    const validPoints = Object.values(points).filter(p => p > 0);
    const sumPoints = validPoints.reduce((sum, p) => sum + p, 0);
    const averagePoints = validPoints.length > 0 ? sumPoints / validPoints.length : 0;
    
    // Update individual ranks state
    setItemRanks({
      walkToStation: pointToRank[points.walkToStation],
      rent: pointToRank[points.rent],
      initialCost: pointToRank[points.initialCost],
      floor: pointToRank[points.floor],
      interior: interior ? pointToRank[points.interior] : '-',
      signage: signage ? pointToRank[points.signage] : '-',
      location: location ? pointToRank[points.location] : '-',
      visibility: visibility ? pointToRank[points.visibility] : '-',
      stationIncome: stationIncome ? pointToRank[points.stationIncome] : '-',
      household1km: pointToRank[points.household1km],
      household1_5km: pointToRank[points.household1_5km],
    });

    setOverallRank(getRankFromPoints(averagePoints));
  };
  
  // Recalculate ranks whenever any input field changes
  useEffect(() => {
    calculateRanks();
  }, [interior, signage, walkToStation, rent, initialCost, floor, location, visibility, stationIncome, household1km, household1_5km]);

  // Handle station income lookup
  useEffect(() => {
    if (nearestStation) {
      const normalizedStationName = nearestStation.trim();
      const income = stationIncomeData[normalizedStationName] || null;
      setStationIncome(income);
    } else {
      setStationIncome(null);
    }
  }, [nearestStation]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [...images];
    const newReportImages = [...reportImages];

    files.forEach(file => {
      if (newImages.length < 4) {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push(reader.result);
          newReportImages.push(reader.result); // レポート用にも同じ画像を保存
          setImages([...newImages]);
          setReportImages([...newReportImages]);
        };
        reader.readAsDataURL(file);
      }
    });
    setImageCount(newImages.length);
  };

  const handleSaveImage = async () => {
    setIsProcessing(true);
    
    if (typeof window.html2canvas === 'undefined') {
      try {
        await new Promise(resolve => {
          const script = document.createElement('script');
          script.src = 'https://html2canvas.hertzen.com/dist/html2canvas.min.js';
          script.onload = resolve;
          document.head.appendChild(script);
        });
      } catch (error) {
        console.error("Failed to load html2canvas script:", error);
        setIsProcessing(false);
        return;
      }
    }

    if (captureRef.current) {
      try {
        const element = captureRef.current;
        
        // 隠し要素を一時的に表示位置に移動
        element.style.position = 'fixed';
        element.style.left = '0';
        element.style.top = '0';
        element.style.zIndex = '9999';
        element.style.backgroundColor = 'white';
        
        // 少し待ってからキャプチャ（レイアウト計算完了を待つ）
        await new Promise(resolve => setTimeout(resolve, 100));

        const canvas = await window.html2canvas(element, {
          scale: 2,
          useCORS: true,
          allowTaint: false,
          backgroundColor: '#ffffff',
          width: element.scrollWidth,
          height: element.scrollHeight,
          scrollX: 0,
          scrollY: 0
        });
        
        // 元の位置に戻す
        element.style.position = 'absolute';
        element.style.left = '-9999px';
        element.style.top = '-9999px';
        element.style.zIndex = 'auto';
        
        const image = canvas.toDataURL('image/png');
        
        const link = document.createElement('a');
        link.href = image;
        link.download = '物件評価レポート.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Failed to generate image:", error);
      } finally {
        setIsProcessing(false);
      }
    } else {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-screen bg-gray-100 font-inter">
      <div className="w-full max-w-2xl bg-white p-6 rounded-3xl shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          不動産物件評価アプリ
        </h1>
        <p className="text-center text-gray-600 mb-8">
          物件情報を入力して、ランクを評価し、画像を生成しましょう。
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-blue-500 transition-colors">
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
            <label htmlFor="image-upload" className="flex flex-col items-center text-gray-500 cursor-pointer">
              <Camera size={48} className="mb-2" />
              <span className="text-sm font-semibold">画像をアップロード (最大4枚)</span>
            </label>
            <p className="text-xs text-gray-400 mt-2">{imageCount} / 4 枚</p>
          </div>

          <div className="col-span-1 md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <MapPin size={20} className="text-gray-500" />
              <label className="flex-shrink-0 w-24 text-gray-700">住所:</label>
              <input
                type="text"
                className="flex-grow p-2 border border-gray-300 rounded-xl"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="例: 東京都渋谷区代々木2-5-1"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Landmark size={20} className="text-gray-500" />
              <label className="flex-shrink-0 w-24 text-gray-700">最寄り駅:</label>
              <input
                type="text"
                className="flex-grow p-2 border border-gray-300 rounded-xl"
                value={nearestStation}
                onChange={(e) => setNearestStation(e.target.value)}
                placeholder="例: 新宿"
              />
              {stationIncome !== null && (
                <span className={`px-2 py-1 text-white text-xs rounded-full font-bold ${rankColors[pointToRank[rankingCriteria.income(stationIncome)]]}`}>
                  {pointToRank[rankingCriteria.income(stationIncome)]}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <MapPin size={20} className="text-gray-500" />
              <label className="flex-shrink-0 w-24 text-gray-700">駅徒歩 (分):</label>
              <input
                type="number"
                className="flex-grow p-2 border border-gray-300 rounded-xl"
                value={walkToStation}
                onChange={(e) => setWalkToStation(e.target.value)}
                placeholder="例: 5"
              />
              {walkToStation && (
                <span className={`px-2 py-1 text-white text-xs rounded-full font-bold ${rankColors[pointToRank[rankingCriteria.walkToStation(walkToStation)]]}`}>
                  {pointToRank[rankingCriteria.walkToStation(walkToStation)]}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign size={20} className="text-gray-500" />
              <label className="flex-shrink-0 w-24 text-gray-700">賃料 (共益費込):</label>
              <input
                type="number"
                className="flex-grow p-2 border border-gray-300 rounded-xl"
                value={rent}
                onChange={(e) => setRent(e.target.value)}
                placeholder="例: 180000"
              />
              {rent && (
                <span className={`px-2 py-1 text-white text-xs rounded-full font-bold ${rankColors[pointToRank[rankingCriteria.rent(rent)]]}`}>
                  {pointToRank[rankingCriteria.rent(rent)]}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Key size={20} className="text-gray-500" />
              <label className="flex-shrink-0 w-24 text-gray-700">初期費用:</label>
              <input
                type="number"
                className="flex-grow p-2 border border-gray-300 rounded-xl"
                value={initialCost}
                onChange={(e) => setInitialCost(e.target.value)}
                placeholder="例: 1500000"
              />
              {initialCost && (
                <span className={`px-2 py-1 text-white text-xs rounded-full font-bold ${rankColors[pointToRank[rankingCriteria.initialCost(initialCost)]]}`}>
                  {pointToRank[rankingCriteria.initialCost(initialCost)]}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Home size={20} className="text-gray-500" />
              <label className="flex-shrink-0 w-24 text-gray-700">フロア:</label>
              <input
                type="number"
                className="flex-grow p-2 border border-gray-300 rounded-xl"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                placeholder="例: 3"
              />
              {floor && (
                <span className={`px-2 py-1 text-white text-xs rounded-full font-bold ${rankColors[pointToRank[rankingCriteria.floor(floor)]]}`}>
                  {pointToRank[rankingCriteria.floor(floor)]}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Home size={20} className="text-gray-500" />
              <label className="flex-shrink-0 w-24 text-gray-700">内装状態:</label>
              <select
                className="flex-grow p-2 border border-gray-300 rounded-xl"
                value={interior}
                onChange={(e) => setInterior(e.target.value)}
              >
                <option value="">選択してください</option>
                <option value="優">優</option>
                <option value="良">良</option>
                <option value="可">可</option>
                <option value="否">否</option>
              </select>
              {interior && (
                <span className={`px-2 py-1 text-white text-xs rounded-full font-bold ${rankColors[pointToRank[rankingCriteria.interior[interior]]]}`}>
                  {pointToRank[rankingCriteria.interior[interior]]}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp size={20} className="text-gray-500" />
              <label className="flex-shrink-0 w-24 text-gray-700">立地:</label>
              <select
                className="flex-grow p-2 border border-gray-300 rounded-xl"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option value="">選択してください</option>
                <option value="優">優</option>
                <option value="良">良</option>
                <option value="可">可</option>
                <option value="否">否</option>
              </select>
              {location && (
                <span className={`px-2 py-1 text-white text-xs rounded-full font-bold ${rankColors[pointToRank[rankingCriteria.location[location]]]}`}>
                  {pointToRank[rankingCriteria.location[location]]}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Eye size={20} className="text-gray-500" />
              <label className="flex-shrink-0 w-24 text-gray-700">視認性:</label>
              <select
                className="flex-grow p-2 border border-gray-300 rounded-xl"
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
              >
                <option value="">選択してください</option>
                <option value="優">優</option>
                <option value="良">良</option>
                <option value="可">可</option>
                <option value="否">否</option>
              </select>
              {visibility && (
                <span className={`px-2 py-1 text-white text-xs rounded-full font-bold ${rankColors[pointToRank[rankingCriteria.visibility[visibility]]]}`}>
                  {pointToRank[rankingCriteria.visibility[visibility]]}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Info size={20} className="text-gray-500" />
              <label className="flex-shrink-0 w-24 text-gray-700">看板設置可否:</label>
              <select
                className="flex-grow p-2 border border-gray-300 rounded-xl"
                value={signage}
                onChange={(e) => setSignage(e.target.value)}
              >
                <option value="">選択してください</option>
                <option value="可">可</option>
                <option value="否">否</option>
              </select>
              {signage && (
                <span className={`px-2 py-1 text-white text-xs rounded-full font-bold ${rankColors[pointToRank[rankingCriteria.signage[signage]]]}`}>
                  {pointToRank[rankingCriteria.signage[signage]]}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Home size={20} className="text-gray-500" />
              <label className="flex-shrink-0 w-24 text-gray-700">周辺世帯数 (1km):</label>
              <input
                type="number"
                className="flex-grow p-2 border border-gray-300 rounded-xl"
                value={household1km}
                onChange={(e) => setHousehold1km(e.target.value)}
                placeholder="例: 36500"
              />
              {household1km && (
                <span className={`px-2 py-1 text-white text-xs rounded-full font-bold ${rankColors[pointToRank[rankingCriteria.household1km(household1km)]]}`}>
                  {pointToRank[rankingCriteria.household1km(household1km)]}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Home size={20} className="text-gray-500" />
              <label className="flex-shrink-0 w-24 text-gray-700">周辺世帯数 (1.5km):</label>
              <input
                type="number"
                className="flex-grow p-2 border border-gray-300 rounded-xl"
                value={household1_5km}
                onChange={(e) => setHousehold1_5km(e.target.value)}
                placeholder="例: 55000"
              />
              {household1_5km && (
                <span className={`px-2 py-1 text-white text-xs rounded-full font-bold ${rankColors[pointToRank[rankingCriteria.household1_5km(household1_5km)]]}`}>
                  {pointToRank[rankingCriteria.household1_5km(household1_5km)]}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center mt-8">
          <div className="flex flex-col items-center p-4 bg-gray-200 rounded-2xl w-full max-w-sm mb-6 shadow-inner">
            <span className="text-lg font-bold text-gray-700">総合ランク:</span>
            <span className={`px-4 py-2 text-5xl font-extrabold text-white rounded-full mt-2 ${overallRank === 'N/A' ? 'bg-gray-400' : rankColors[overallRank]}`}>
              {overallRank}
            </span>
          </div>

          <button
            onClick={handleSaveImage}
            disabled={isProcessing}
            className="flex items-center justify-center space-x-2 px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg hover:bg-blue-700 transition-colors transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>生成中...</span>
              </>
            ) : (
              <>
                <Camera size={24} />
                <span>画像を生成して保存</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* レポート生成用の隠し要素 - 完全にインラインスタイルで構築 */}
      <div 
        ref={captureRef} 
        style={{ 
          position: 'absolute',
          left: '-9999px', 
          top: '-9999px',
          width: '794px',    // A4幅（210mm ≈ 794px at 96dpi）
          height: '1123px',  // A4高さ（297mm ≈ 1123px at 96dpi）
          padding: '24px',
          boxSizing: 'border-box',
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          lineHeight: '1.4',
          backgroundColor: 'white'
        }}
      >
        {/* ヘッダー */}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>物件評価レポート</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#4b5563' }}>総合ランク:</span>
            <span style={{ 
              padding: '8px 12px', 
              fontSize: '18px', 
              fontWeight: '800', 
              color: 'white', 
              borderRadius: '9999px',
              backgroundColor: overallRank === 'SS' ? '#10b981' :
                              overallRank === 'S' ? '#3b82f6' :
                              overallRank === 'A' ? '#eab308' :
                              overallRank === 'B' ? '#ef4444' : '#9ca3af'
            }}>
              {overallRank}
            </span>
          </div>
        </div>
        
        {/* 画像セクション - 完全に独立したレイアウト */}
        <div style={{ width: '100%', height: '320px', marginBottom: '16px' }}>
          <div style={{ 
            height: '100%',
            display: 'grid',
            gap: '4px',
            padding: '8px',
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
            gridTemplateColumns: reportImages.length === 1 ? '1fr' : 
                                reportImages.length === 2 ? '1fr 1fr' : 
                                '1fr 1fr',
            gridTemplateRows: reportImages.length <= 2 ? '1fr' : '1fr 1fr'
          }}>
            {reportImages.map((img, index) => (
              <div 
                key={`report-img-${index}`}
                style={{
                  overflow: 'hidden',
                  borderRadius: '4px',
                  backgroundColor: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <img 
                  src={img}
                  alt={`物件画像 ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* 物件詳細セクション - 全てインラインスタイル */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px' }}>
          
          {/* 住所行 */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            padding: '8px', 
            backgroundColor: '#f3f4f6', 
            borderRadius: '8px',
            gridColumn: 'span 2'
          }}>
            <span style={{ color: '#374151' }}>住所:</span>
            <span style={{ color: '#111827', fontWeight: '500' }}>{address || '-'}</span>
          </div>
          
          {/* 最寄り駅 */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            padding: '8px', 
            backgroundColor: '#f3f4f6', 
            borderRadius: '8px'
          }}>
            <span style={{ color: '#374151' }}>最寄り駅:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#111827', fontWeight: '500' }}>{nearestStation || '-'}</span>
              <span style={{
                padding: '4px 8px',
                color: 'white',
                fontWeight: 'bold',
                borderRadius: '9999px',
                fontSize: '11px',
                backgroundColor: itemRanks.stationIncome === 'SS' ? '#10b981' :
                                itemRanks.stationIncome === 'S' ? '#3b82f6' :
                                itemRanks.stationIncome === 'A' ? '#eab308' :
                                itemRanks.stationIncome === 'B' ? '#ef4444' : '#9ca3af'
              }}>
                {itemRanks.stationIncome}
              </span>
            </div>
          </div>
          
          {/* 駅徒歩 */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            padding: '8px', 
            backgroundColor: '#f3f4f6', 
            borderRadius: '8px'
          }}>
            <span style={{ color: '#374151' }}>駅徒歩:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#111827', fontWeight: '500' }}>{walkToStation ? `${walkToStation}分` : '-'}</span>
              <span style={{
                padding: '4px 8px',
                color: 'white',
                fontWeight: 'bold',
                borderRadius: '9999px',
                fontSize: '11px',
                backgroundColor: itemRanks.walkToStation === 'SS' ? '#10b981' :
                                itemRanks.walkToStation === 'S' ? '#3b82f6' :
                                itemRanks.walkToStation === 'A' ? '#eab308' :
                                itemRanks.walkToStation === 'B' ? '#ef4444' : '#9ca3af'
              }}>
                {itemRanks.walkToStation}
              </span>
            </div>
          </div>
          
          {/* 内装状態 */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            padding: '8px', 
            backgroundColor: '#f3f4f6', 
            borderRadius: '8px'
          }}>
            <span style={{ color: '#374151' }}>内装状態:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#111827', fontWeight: '500' }}>{interior || '-'}</span>
              <span style={{
                padding: '4px 8px',
                color: 'white',
                fontWeight: 'bold',
                borderRadius: '9999px',
                fontSize: '11px',
                backgroundColor: itemRanks.interior === 'SS' ? '#10b981' :
                                itemRanks.interior === 'S' ? '#3b82f6' :
                                itemRanks.interior === 'A' ? '#eab308' :
                                itemRanks.interior === 'B' ? '#ef4444' : '#9ca3af'
              }}>
                {itemRanks.interior}
              </span>
            </div>
          </div>
          
          {/* 看板設置可否 */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            padding: '8px', 
            backgroundColor: '#f3f4f6', 
            borderRadius: '8px'
          }}>
            <span style={{ color: '#374151' }}>看板設置可否:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#111827', fontWeight: '500' }}>{signage || '-'}</span>
              <span style={{
                padding: '4px 8px',
                color: 'white',
                fontWeight: 'bold',
                borderRadius: '9999px',
                fontSize: '11px',
                backgroundColor: itemRanks.signage === 'SS' ? '#10b981' :
                                itemRanks.signage === 'S' ? '#3b82f6' :
                                itemRanks.signage === 'A' ? '#eab308' :
                                itemRanks.signage === 'B' ? '#ef4444' : '#9ca3af'
              }}>
                {itemRanks.signage}
              </span>
            </div>
          </div>
          
          {/* 賃料 */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            padding: '8px', 
            backgroundColor: '#f3f4f6', 
            borderRadius: '8px'
          }}>
            <span style={{ color: '#374151' }}>賃料:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#111827', fontWeight: '500' }}>{rent ? `${parseInt(rent).toLocaleString()}円` : '-'}</span>
              <span style={{
                padding: '4px 8px',
                color: 'white',
                fontWeight: 'bold',
                borderRadius: '9999px',
                fontSize: '11px',
                backgroundColor: itemRanks.rent === 'SS' ? '#10b981' :
                                itemRanks.rent === 'S' ? '#3b82f6' :
                                itemRanks.rent === 'A' ? '#eab308' :
                                itemRanks.rent === 'B' ? '#ef4444' : '#9ca3af'
              }}>
                {itemRanks.rent}
              </span>
            </div>
          </div>
          
          {/* 初期費用 */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            padding: '8px', 
            backgroundColor: '#f3f4f6', 
            borderRadius: '8px'
          }}>
            <span style={{ color: '#374151' }}>初期費用:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#111827', fontWeight: '500' }}>{initialCost ? `${parseInt(initialCost).toLocaleString()}円` : '-'}</span>
              <span style={{
                padding: '4px 8px',
                color: 'white',
                fontWeight: 'bold',
                borderRadius: '9999px',
                fontSize: '11px',
                backgroundColor: itemRanks.initialCost === 'SS' ? '#10b981' :
                                itemRanks.initialCost === 'S' ? '#3b82f6' :
                                itemRanks.initialCost === 'A' ? '#eab308' :
                                itemRanks.initialCost === 'B' ? '#ef4444' : '#9ca3af'
              }}>
                {itemRanks.initialCost}
              </span>
            </div>
          </div>
          
          {/* 立地 */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            padding: '8px', 
            backgroundColor: '#f3f4f6', 
            borderRadius: '8px'
          }}>
            <span style={{ color: '#374151' }}>立地:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#111827', fontWeight: '500' }}>{location || '-'}</span>
              <span style={{
                padding: '4px 8px',
                color: 'white',
                fontWeight: 'bold',
                borderRadius: '9999px',
                fontSize: '11px',
                backgroundColor: itemRanks.location === 'SS' ? '#10b981' :
                                itemRanks.location === 'S' ? '#3b82f6' :
                                itemRanks.location === 'A' ? '#eab308' :
                                itemRanks.location === 'B' ? '#ef4444' : '#9ca3af'
              }}>
                {itemRanks.location}
              </span>
            </div>
          </div>
          
          {/* フロア */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            padding: '8px', 
            backgroundColor: '#f3f4f6', 
            borderRadius: '8px'
          }}>
            <span style={{ color: '#374151' }}>フロア:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#111827', fontWeight: '500' }}>{floor || '-'}</span>
              <span style={{
                padding: '4px 8px',
                color: 'white',
                fontWeight: 'bold',
                borderRadius: '9999px',
                fontSize: '11px',
                backgroundColor: itemRanks.floor === 'SS' ? '#10b981' :
                                itemRanks.floor === 'S' ? '#3b82f6' :
                                itemRanks.floor === 'A' ? '#eab308' :
                                itemRanks.floor === 'B' ? '#ef4444' : '#9ca3af'
              }}>
                {itemRanks.floor}
              </span>
            </div>
          </div>
          
          {/* 視認性 */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            padding: '8px', 
            backgroundColor: '#f3f4f6', 
            borderRadius: '8px'
          }}>
            <span style={{ color: '#374151' }}>視認性:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#111827', fontWeight: '500' }}>{visibility || '-'}</span>
              <span style={{
                padding: '4px 8px',
                color: 'white',
                fontWeight: 'bold',
                borderRadius: '9999px',
                fontSize: '11px',
                backgroundColor: itemRanks.visibility === 'SS' ? '#10b981' :
                                itemRanks.visibility === 'S' ? '#3b82f6' :
                                itemRanks.visibility === 'A' ? '#eab308' :
                                itemRanks.visibility === 'B' ? '#ef4444' : '#9ca3af'
              }}>
                {itemRanks.visibility}
              </span>
            </div>
          </div>
          
          {/* 周辺世帯年収 */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            padding: '8px', 
            backgroundColor: '#f3f4f6', 
            borderRadius: '8px'
          }}>
            <span style={{ color: '#374151' }}>周辺世帯年収:</span>
            <span style={{ color: '#111827', fontWeight: '500' }}>
              {stationIncome ? `${stationIncome.toLocaleString()}円` : '-'}
            </span>
          </div>
          
          {/* 周辺世帯数 (1km) */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            padding: '8px', 
            backgroundColor: '#f3f4f6', 
            borderRadius: '8px'
          }}>
            <span style={{ color: '#374151' }}>周辺世帯数 (1km):</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#111827', fontWeight: '500' }}>
                {household1km ? `${parseInt(household1km).toLocaleString()}世帯` : '-'}
              </span>
              <span style={{
                padding: '4px 8px',
                color: 'white',
                fontWeight: 'bold',
                borderRadius: '9999px',
                fontSize: '11px',
                backgroundColor: itemRanks.household1km === 'SS' ? '#10b981' :
                                itemRanks.household1km === 'S' ? '#3b82f6' :
                                itemRanks.household1km === 'A' ? '#eab308' :
                                itemRanks.household1km === 'B' ? '#ef4444' : '#9ca3af'
              }}>
                {itemRanks.household1km}
              </span>
            </div>
          </div>
          
          {/* 周辺世帯数 (1.5km) */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            padding: '8px', 
            backgroundColor: '#f3f4f6', 
            borderRadius: '8px'
          }}>
            <span style={{ color: '#374151' }}>周辺世帯数 (1.5km):</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#111827', fontWeight: '500' }}>
                {household1_5km ? `${parseInt(household1_5km).toLocaleString()}世帯` : '-'}
              </span>
              <span style={{
                padding: '4px 8px',
                color: 'white',
                fontWeight: 'bold',
                borderRadius: '9999px',
                fontSize: '11px',
                backgroundColor: itemRanks.household1_5km === 'SS' ? '#10b981' :
                                itemRanks.household1_5km === 'S' ? '#3b82f6' :
                                itemRanks.household1_5km === 'A' ? '#eab308' :
                                itemRanks.household1_5km === 'B' ? '#ef4444' : '#9ca3af'
              }}>
                {itemRanks.household1_5km}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
}
