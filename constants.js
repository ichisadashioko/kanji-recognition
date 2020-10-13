export let MIN_RADIUS = 1;
export let MAX_RADIUS = 5;
export let MIN_DISTANCE = 1;
export let MAX_DISTANCE = 96;
export let PAD_WIDTH = 64;
export let PAD_HEIGHT = 64;

export let INDICES_TO_LABELS = [
    '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '口', '日', '月', '田', '目', '古', '吾', '冒', '朋', '明', '唱', '晶', '品', '呂', '昌', '早', '旭', '世', '胃', '旦', '胆', '亘',
    '凹', '凸', '旧', '自', '白', '百', '中', '千', '舌', '升', '昇', '丸', '寸', '専', '博', '占', '上', '下', '卓', '朝', '只', '貝', '貞', '員', '見', '児', '元', '頁', '頑', '凡', '負', '万',
    '句', '肌', '旬', '勺', '的', '首', '乙', '乱', '直', '具', '真', '工', '左', '右', '有', '賄', '貢', '項', '刀', '刃', '切', '召', '昭', '則', '副', '別', '丁', '町', '可', '頂', '子', '孔',
    '了', '女', '好', '如', '母', '貫', '兄', '克', '小', '少', '大', '多', '夕', '汐', '外', '名', '石', '肖', '硝', '砕', '砂', '削', '光', '太', '器', '臭', '妙', '省', '厚', '奇', '川', '州',
    '順', '水', '氷', '永', '泉', '原', '願', '泳', '沼', '沖', '江', '汁', '潮', '源', '活', '消', '況', '河', '泊', '湖', '測', '土', '吐', '圧', '埼', '垣', '圭', '封', '涯', '寺', '時', '均',
    '火', '炎', '煩', '淡', '灯', '畑', '災', '灰', '点', '照', '魚', '漁', '里', '黒', '墨', '鯉', '量', '厘', '埋', '同', '洞', '胴', '向', '尚', '字', '守', '完', '宣', '宵', '安', '宴', '寄',
    '富', '貯', '木', '林', '森', '桂', '柏', '枠', '梢', '棚', '杏', '桐', '植', '枯', '朴', '村', '相', '机', '本', '札', '暦', '案', '燥', '未', '末', '沫', '味', '妹', '朱', '株', '若', '草',
    '苦', '寛', '薄', '葉', '模', '漠', '墓', '暮', '膜', '苗', '兆', '桃', '眺', '犬', '状', '黙', '然', '荻', '狩', '猫', '牛', '特', '告', '先', '洗', '介', '界', '茶', '合', '塔', '王', '玉',
    '宝', '珠', '現', '狂', '皇', '呈', '全', '栓', '理', '主', '注', '柱', '金', '銑', '鉢', '銅', '釣', '針', '銘', '鎮', '道', '導', '辻', '迅', '造', '迫', '逃', '辺', '巡', '車', '連', '軌',
    '輸', '前', '各', '格', '略', '客', '額', '夏', '処', '条', '落', '冗', '軍', '輝', '運', '冠', '夢', '坑', '高', '享', '塾', '熟', '亭', '京', '涼', '景', '鯨', '舎', '周', '週', '士', '吉',
    '壮', '荘', '売', '学', '覚', '栄', '書', '津', '牧', '攻', '敗', '枚', '故', '敬', '言', '警', '計', '獄', '訂', '討', '訓', '詔', '詰', '話', '詠', '詩', '語', '読', '調', '談', '諾', '諭',
    '式', '試', '弐', '域', '賊', '栽', '載', '茂', '成', '城', '誠', '威', '滅', '減', '桟', '銭', '浅', '止', '歩', '渉', '頻', '肯', '企', '歴', '武', '賦', '正', '証', '政', '定', '錠', '走',
    '超', '赴', '越', '是', '題', '堤', '建', '延', '誕', '礎', '婿', '衣', '裁', '装', '裏', '壊', '哀', '遠', '猿', '初', '布', '帆', '幅', '帽', '幕', '幌', '錦', '市', '姉', '肺', '帯', '滞',
    '刺', '制', '製', '転', '芸', '雨', '雲', '曇', '雷', '霜', '冬', '天', '橋', '嬌', '立', '泣', '章', '競', '帝', '童', '瞳', '鐘', '商', '嫡', '適', '滴', '敵', '匕', '北', '背', '比', '昆',
    '皆', '混', '渇', '謁', '褐', '喝', '旨', '脂', '壱', '毎', '敏', '梅', '海', '乞', '乾', '腹', '複', '欠', '吹', '炊', '歌', '軟', '次', '茨', '資', '姿', '諮', '賠', '培', '剖', '音', '暗',
    '韻', '識', '鏡', '境', '亡', '盲', '妄', '荒', '望', '方', '妨', '坊', '芳', '肪', '訪', '放', '激', '脱', '説', '鋭', '曽', '増', '贈', '東', '棟', '凍', '妊', '廷', '染', '燃', '賓', '歳',
    '県', '栃', '地', '池', '虫', '蛍', '蛇', '虹', '蝶', '独', '蚕', '風', '己', '起', '妃', '改', '記', '包', '胞', '砲', '泡', '亀', '電', '竜', '滝', '豚', '逐', '遂', '家', '嫁', '豪', '腸',
    '場', '湯', '羊', '美', '洋', '詳', '鮮', '達', '羨', '差', '着', '唯', '焦', '礁', '集', '准', '進', '雑', '雌', '準', '奮', '奪', '確', '午', '許', '歓', '権', '観', '羽', '習', '翌', '曜',
    '濯', '曰', '困', '固', '国', '団', '因', '姻', '園', '回', '壇', '店', '庫', '庭', '庁', '床', '麻', '磨', '心', '忘', '忍', '認', '忌', '志', '誌', '忠', '串', '患', '思', '恩', '応', '意',
    '想', '息', '憩', '恵', '恐', '惑', '感', '憂', '寡', '忙', '悦', '恒', '悼', '悟', '怖', '慌', '悔', '憎', '慣', '愉', '惰', '慎', '憾', '憶', '慕', '添', '必', '泌', '手', '看', '摩', '我',
    '義', '議', '犠', '抹', '抱', '搭', '抄', '抗', '批', '招', '拓', '拍', '打', '拘', '捨', '拐', '摘', '挑', '指', '持', '括', '揮', '推', '揚', '提', '損', '拾', '担', '拠', '描', '操', '接',
    '掲', '掛', '研', '戒', '械', '鼻', '刑', '型', '才', '財', '材', '存', '在', '乃', '携', '及', '吸', '扱', '丈', '史', '吏', '更', '硬', '又', '双', '桑', '隻', '護', '獲', '奴', '怒', '友',
    '抜', '投', '没', '設', '撃', '殻', '支', '技', '枝', '肢', '茎', '怪', '軽', '叔', '督', '寂', '淑', '反', '坂', '板', '返', '販', '爪', '妥', '乳', '浮', '将', '奨', '採', '菜', '受', '授',
    '愛', '払', '広', '拡', '鉱', '弁', '雄', '台', '怠', '治', '始', '胎', '窓', '去', '法', '会', '至', '室', '到', '致', '互', '棄', '育', '撤', '充', '銃', '硫', '流', '允', '唆', '出', '山',
    '拙', '岩', '炭', '岐', '峠', '崩', '密', '蜜', '嵐', '崎', '入', '込', '分', '貧', '頒', '公', '松', '翁', '訟', '谷', '浴', '容', '溶', '欲', '裕', '鉛', '沿', '賞', '党', '堂', '常', '裳',
    '掌', '皮', '波', '婆', '披', '破', '被', '残', '殉', '殊', '殖', '列', '裂', '烈', '死', '葬', '瞬', '耳', '取', '趣', '最', '撮', '恥', '職', '聖', '敢', '聴', '懐', '慢', '漫', '買', '置',
    '罰', '寧', '濁', '環', '還', '夫', '扶', '渓', '規', '替', '賛', '潜', '失', '鉄', '迭', '臣', '姫', '蔵', '臓', '賢', '堅', '臨', '覧', '巨', '拒', '力', '男', '労', '募', '劣', '功', '勧',
    '努', '励', '加', '賀', '架', '脇', '脅', '協', '行', '律', '復', '得', '従', '徒', '待', '往', '征', '径', '彼', '役', '徳', '徹', '徴', '懲', '微', '街', '衡', '稿', '稼', '程', '税', '稚',
    '和', '移', '秒', '秋', '愁', '私', '秩', '秘', '称', '利', '梨', '穫', '穂', '稲', '香', '季', '委', '秀', '透', '誘', '穀', '菌', '米', '粉', '粘', '粒', '粧', '迷', '粋', '糧', '菊', '奥',
    '数', '楼', '類', '漆', '様', '求', '球', '救', '竹', '笑', '笠', '笹', '筋', '箱', '筆', '筒', '等', '算', '答', '策', '簿', '築', '人', '佐', '但', '住', '位', '仲', '体', '悠', '件', '仕',
    '他', '伏', '伝', '仏', '休', '仮', '伯', '俗', '信', '佳', '依', '例', '個', '健', '側', '侍', '停', '値', '倣', '倒', '偵', '僧', '億', '儀', '償', '仙', '催', '仁', '侮', '使', '便', '倍',
    '優', '伐', '宿', '傷', '保', '褒', '傑', '付', '符', '府', '任', '賃', '代', '袋', '貸', '化', '花', '貨', '傾', '何', '荷', '俊', '傍', '久', '畝', '囚', '内', '丙', '柄', '肉', '腐', '座',
    '卒', '傘', '匁', '以', '似', '併', '瓦', '瓶', '宮', '営', '善', '年', '夜', '液', '塚', '幣', '弊', '喚', '換', '融', '施', '旋', '遊', '旅', '勿', '物', '易', '賜', '尿', '尼', '泥', '塀',
    '履', '屋', '握', '屈', '掘', '堀', '居', '据', '層', '局', '遅', '漏', '刷', '尺', '尽', '沢', '訳', '択', '昼', '戸', '肩', '房', '扇', '炉', '戻', '涙', '雇', '顧', '啓', '示', '礼', '祥',
    '祝', '福', '祉', '社', '視', '奈', '尉', '慰', '款', '禁', '襟', '宗', '崇', '祭', '察', '擦', '由', '抽', '油', '袖', '宙', '届', '笛', '軸', '甲', '押', '岬', '挿', '申', '伸', '神', '捜',
    '果', '菓', '課', '裸', '斤', '析', '所', '祈', '近', '折', '哲', '逝', '誓', '暫', '漸', '断', '質', '斥', '訴', '昨', '詐', '作', '雪', '録', '尋', '急', '穏', '侵', '浸', '寝', '婦', '掃',
    '当', '争', '浄', '事', '唐', '糖', '康', '逮', '伊', '君', '群', '耐', '需', '儒', '端', '両', '満', '画', '歯', '曲', '曹', '遭', '漕', '槽', '斗', '料', '科', '図', '用', '庸', '備', '昔',
    '錯', '借', '惜', '措', '散', '廿', '庶', '遮', '席', '度', '渡', '奔', '噴', '墳', '憤', '焼', '暁', '半', '伴', '畔', '判', '券', '巻', '圏', '勝', '藤', '謄', '片', '版', '之', '乏', '芝',
    '不', '否', '杯', '矢', '矯', '族', '知', '智', '矛', '柔', '務', '霧', '班', '帰', '弓', '引', '弔', '弘', '強', '弱', '沸', '費', '第', '弟', '巧', '号', '朽', '誇', '汚', '与', '写', '身',
    '射', '謝', '老', '考', '孝', '教', '拷', '者', '煮', '著', '署', '暑', '諸', '猪', '渚', '賭', '峡', '狭', '挟', '追', '師', '帥', '官', '棺', '管', '父', '交', '効', '較', '校', '足', '促',
    '距', '路', '露', '跳', '躍', '践', '踏', '骨', '滑', '髄', '禍', '渦', '過', '阪', '阿', '際', '障', '随', '陪', '陽', '陳', '防', '附', '院', '陣', '隊', '墜', '降', '階', '陛', '隣', '隔',
    '隠', '堕', '陥', '穴', '空', '控', '突', '究', '窒', '窃', '窪', '搾', '窯', '窮', '探', '深', '丘', '岳', '兵', '浜', '糸', '織', '繕', '縮', '繁', '縦', '線', '締', '維', '羅', '練', '緒',
    '続', '絵', '統', '絞', '給', '絡', '結', '終', '級', '紀', '紅', '納', '紡', '紛', '紹', '経', '紳', '約', '細', '累', '索', '総', '綿', '絹', '繰', '継', '緑', '縁', '網', '緊', '紫', '縛',
    '縄', '幼', '後', '幽', '幾', '機', '玄', '畜', '蓄', '弦', '擁', '滋', '慈', '磁', '系', '係', '孫', '懸', '却', '脚', '卸', '御', '服', '命', '令', '零', '齢', '冷', '領', '鈴', '勇', '通',
    '踊', '疑', '擬', '凝', '範', '犯', '厄', '危', '宛', '腕', '苑', '怨', '柳', '卵', '留', '貿', '印', '興', '酉', '酒', '酌', '酵', '酷', '酬', '酪', '酢', '酔', '配', '酸', '猶', '尊', '豆',
    '頭', '短', '豊', '鼓', '喜', '樹', '皿', '血', '盆', '盟', '盗', '温', '監', '濫', '鑑', '猛', '盛', '塩', '銀', '恨', '根', '即', '爵', '節', '退', '限', '眼', '良', '朗', '浪', '娘', '食',
    '飯', '飲', '飢', '餓', '飾', '館', '養', '飽', '既', '概', '慨', '平', '呼', '坪', '評', '刈', '希', '凶', '胸', '離', '殺', '純', '鈍', '辛', '辞', '梓', '宰', '壁', '避', '新', '薪', '親',
    '幸', '執', '報', '叫', '糾', '収', '卑', '碑', '陸', '睦', '勢', '熱', '菱', '陵', '亥', '核', '刻', '該', '劾', '述', '術', '寒', '醸', '譲', '壌', '嬢', '毒', '素', '麦', '青', '精', '請',
    '情', '晴', '清', '静', '責', '績', '積', '債', '漬', '表', '俵', '潔', '契', '喫', '害', '轄', '割', '憲', '生', '星', '姓', '性', '牲', '産', '隆', '峰', '縫', '拝', '寿', '鋳', '籍', '春',
    '椿', '泰', '奏', '実', '奉', '俸', '棒', '謹', '勤', '漢', '嘆', '難', '華', '垂', '睡', '錘', '乗', '剰', '今', '含', '吟', '念', '琴', '陰', '予', '序', '預', '野', '兼', '嫌', '鎌', '謙',
    '廉', '西', '価', '要', '腰', '票', '漂', '標', '栗', '遷', '覆', '煙', '南', '楠', '献', '門', '問', '閲', '閥', '間', '簡', '開', '閉', '閣', '閑', '聞', '潤', '欄', '闘', '倉', '創', '非',
    '俳', '排', '悲', '罪', '輩', '扉', '侯', '候', '決', '快', '偉', '違', '緯', '衛', '韓', '干', '肝', '刊', '汗', '軒', '岸', '幹', '芋', '宇', '余', '除', '徐', '叙', '途', '斜', '塗', '束',
    '頼', '瀬', '勅', '疎', '速', '整', '剣', '険', '検', '倹', '重', '動', '勲', '働', '種', '衝', '薫', '病', '痴', '痘', '症', '疾', '痢', '疲', '疫', '痛', '癖', '匿', '匠', '医', '匹', '区',
    '枢', '殴', '欧', '抑', '仰', '迎', '登', '澄', '発', '廃', '僚', '寮', '療', '彫', '形', '影', '杉', '彩', '彰', '彦', '顔', '須', '膨', '参', '惨', '修', '珍', '診', '文', '普', '譜', '湿',
    '顕', '繊', '霊', '業', '撲', '僕', '共', '供', '異', '翼', '洪', '港', '対', '紋', '蚊', '斉', '剤', '済', '斎', '粛', '塁', '楽', '薬', '率', '渋', '摂', '央', '英', '映', '赤', '赦', '変',
    '跡', '蛮', '恋', '湾', '黄', '横', '把', '色', '絶', '艶', '肥', '甘', '紺', '某', '謀', '媒', '欺', '棋', '旗', '期', '碁', '基', '甚', '勘', '堪', '貴', '遺', '遣', '舞', '無', '組', '粗',
    '租', '祖', '阻', '査', '助', '宜', '畳', '並', '暴', '爆', '恭', '選', '殿', '井', '囲', '耕', '亜', '悪', '円', '角', '触', '解', '再', '講', '購', '構', '溝', '論', '倫', '輪', '偏', '遍',
    '編', '冊', '典', '氏', '紙', '婚', '低', '抵', '底', '民', '眠', '捕', '浦', '蒲', '舗', '補', '邸', '郭', '郡', '郊', '部', '都', '郵', '邦', '郷', '響', '郎', '廊', '盾', '循', '派', '脈',
    '衆', '逓', '段', '鍛', '后', '幻', '司', '伺', '詞', '飼', '嗣', '舟', '舶', '航', '般', '盤', '搬', '船', '艦', '艇', '瓜', '弧', '孤', '繭', '益', '暇', '敷', '来', '気', '汽', '飛', '沈',
    '妻', '衰', '衷', '面', '革', '靴', '覇', '声', '呉', '娯', '誤', '蒸', '承', '函', '極', '牙', '芽', '邪', '雅', '釈', '番', '審', '翻', '藩', '毛', '耗', '尾', '宅', '託', '為', '偽', '長',
    '張', '帳', '脹', '髪', '展', '喪', '巣', '単', '戦', '禅', '弾', '桜', '獣', '脳', '悩', '厳', '鎖', '挙', '誉', '猟', '鳥', '鳴', '鶴', '烏', '蔦', '鳩', '鶏', '島', '暖', '媛', '援', '緩',
    '属', '嘱', '偶', '遇', '愚', '隅', '逆', '塑', '岡', '鋼', '綱', '剛', '缶', '陶', '揺', '謡', '就', '懇', '墾', '免', '逸', '晩', '勉', '象', '像', '馬', '駒', '験', '騎', '駐', '駆', '駅',
    '騒', '駄', '驚', '篤', '騰', '虎', '虜', '膚', '虚', '戯', '虞', '慮', '劇', '虐', '鹿', '薦', '慶', '麗', '熊', '能', '態', '寅', '演', '辰', '辱', '震', '振', '娠', '唇', '農', '濃', '送',
    '関', '咲', '鬼', '醜', '魂', '魔', '魅', '塊', '襲', '嚇', '朕', '雰', '箇', '錬', '遵', '罷', '屯', '且', '藻', '隷', '癒', '丹', '潟', '丑', '卯', '巳', '肘', '嘲', '唄', '貼', '呪', '妬',
    '嗅', '腺', '汎', '汰', '沙', '填', '椅', '昧', '苛', '脊', '玩', '旺', '喻', '煎', '賂', '冥', '詮', '訃', '戚', '蔑', '鍵', '巾', '柿', '妖', '沃', '諦', '叱', '匂', '頃', '楷', '諧', '葛',
    '詣', '堆', '椎', '誰', '錮', '咽', '恣', '芯', '臆', '惧', '憧', '憬', '拭', '拉', '拶', '捗', '弄', '梗', '股', '淫', '采', '曖', '勾', '冶', '崖', '腎', '勃', '桁', '稽', '萎', '謎', '膝',
    '箋', '篭', '侶', '伎', '傲', '俺', '挫', '膳', '蔽', '尻', '裾', '斬', '臼', '毀', '剥', '彙', '拳', '挨', '弥', '溺', '顎', '箸', '頬', '阜', '釜', '捉', '踪', '鍋', '隙', '窟', '緻', '綻',
    '畿', '遜', '湧', '氾', '瑠', '酎', '蓋', '藍', '餌', '餅', '刹', '璃', '爽', '頓', '璧', '摯', '骸', '塞', '醒', '蜂', '僅', '唾', '貪', '捻', '慄', '闇', '喉', '辣', '腫', '瘍', '痩', '嫉',
    '痕', '瞭', '斑', '潰', '狙', '戴', '丼', '柵', '哺', '那', '舷', '枕', '凄', '麺', '眉', '畏', '遡', '鬱', '蹴', '貌', '罵', '麓', '羞',
]