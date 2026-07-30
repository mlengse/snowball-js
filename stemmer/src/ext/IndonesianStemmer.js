function IndonesianStemmer() {
	var rootWordsCache = null;
	function getRootWords() {
		if (!rootWordsCache) {
			rootWordsCache = new Set("phk,ptun,maaf,pabrik,mabuk,pacak,macan,pacar,pacek,macet,pacik,pacu,pacuk,pacul,pada,madah,padam,padan,padat,madrasah,padu,madu,padu padan,paes,mafhum,magang,pagar,pagas,magnet,pagut,paha,mahal,paham,pahat,mahfuz,mahir,pahit,mahkota,pailit,main,pair,pajak,majal,pajang,pajan,majemuk,maju,pajuh,pakai,pakal,makam,makan,pakan,pakat,makbul,makelar,paket,makhluk,maki,maklumat,maklum,makmum,makmur,makna,makruh,paksa,maksimal,maksud,paku,pakuk,makzul,palai,palak,palam,malam,palang,palar,malas,pale,maling,paling,palis,palit,palsu,palu,malu,palun,palut,mamah,mambung,pamer,pamit,pampang,pampas,pampat,panah,manajemen,manajer,panas,manau,pancal,pancang,pancar,pancar terus,pancing,pancit,pancung,mancung,pancur,pancut,pandai,pandak,pandang,mandat,mandek,mandi,mandiri,mandor,pandu,mandul,panen,manfaat,panggak,panggang,panggil,panggul,panggung,pangkah,pangkal,pangkas,pangkat,pangkek,pangku,mangkuk,pangkung,pangkur,mangsa,pangsa,panguk,pangur,manifestasi,manik,manipulasi,panir,manis,panitia,manja,panjang,panjat,panjing,panjut,mansukh,pantai,pantak,pantang,mantap,pantas,pantat,pantau,pantek,pantik,pantis,mantra,pantul,pantun,manual,manufaktur,manusia,manusiawi,manut,manyun,papah,papak,papan,mapan,papar,papas,papras,paraf,parafrasa,marah,marak,mara,parak,parang,paran,parap,paras,parasit,marga,marginalisasi,marginal,margin,parih,marinade,marinasi,paripurna,parit,markah,parkir,parodi,martabat,paruh,parun,parut,masa bodoh,masai,pasak,masak,masalah,masam,pasang,masap,pasar,maserasi,pasif,masin,maskot,maskulin,maslahat,pasok,pasrah,massal,master,pasteurisasi,pasti,pasuk,masuk,pasung,masyarakat,masygul,masyhur,mata-mata,patah,matang,patar,paten,patik,mati,patil,pating,patok,patri,patroli,patuh,patuk,matu,patung,patut,mau,pauk,paut,payah,maya,payang,payet,payung,mazhab,mazmur,babak,baban,babar,babas,babat,babi,babil,babit,baca,bacah,bacem,bacok,bacot,badai,badan,badi,badik,badut,bagai,bagar,bagi,bagong,bagul,bagus,bahagia,baham,bahan,bahana,baharu,bahas,bahasa,bahaya,bahu,baiat,baik,baja,bajak,bajau,baji,baju,bajul,bakal,bakar,bakat,baksi,bakti,baku,bakut,balah,balak,balam,balap,balas,balik,baling,balsam,balun,balur,balut,banat,bancang,bancar,bancuh,bandar,bandel,bandering,banderol,banding,bandit,bandul,bandung,bandut,bangat,bangga,banggel,bangir,bangkang,bangkar,bangkit,bangkrut,bangku,bangsa,bangun,baning,banjar,banjir,banjur,bantah,bantai,bantal,bantar,banter,banting,bantu,bantun,bantut,banyak,banyol,baptis,bara,barah,barak,barat,barbur,bareng,baret,barikade,baring,baris,barter,baru,barut,basah,basi,basmi,bastar,basuh,basung,basut,batak,batal,batang,batas,batik,batin,batu,batuk,bau,baun,baur,bawa,bawah,bawang,bayang,bayan,bayar,bayonet,bayong,bea,beban,bebas,bebas murni,bebas tugas,bebat,bebek,beber,becek,beda,bedah,bedak,bedal,bedel,bedil,bedol,bedung,bega,begal,begar,begini,begitu,behandel,bejat,beka,bekal,bekam,bekap,bekas,beku,bekuk,bela,belah,belahak,belai,ajar,belakang,belalak,belalang,belam,belanda,belandang,belanja,belar,belasah,belas,belasut,belat,belau,belek,belendung,beleng,belenggu,belengket,belengkok,belenting,beli,beliak,belintang,belit,belok,belongsong,belontang,belot,belu,belu-belai,beludak,belukar,belungsing,bembam,benah,bena,benalu,benam,benang,benar,bencah,bencana,benci,benda,bendera,bendi,bendung,bengang,bengis,bengkah,bengkak,bengkalai,bengkar,bengkel,bengkok,bengkos,bengkung,benih,bening,benjol,bentak,bentang,bentar,benteh,benteng,bentrok,bentuk,bentur,benum,benyai,benyek,beo,berahi,berai,bera,berak,berandal,berang,berangkat,berangsang,berangus,berani,berantak,berantas,berat,canda,daya,diri,beredel,berengut,berentang,beres,berhala,henti,beri,beri tahu,berita,jaya,berkah,berkas,berkat,laku,olahraga,beron,berondong,berongsang,berongsong,berontak,berosot,sama,bersih,bersil,bersit,bersut,berungut,berus,besar,beset,besi,besit,besi tua,beslah,bestel,besuk,besut,betah,betas,betawi,beting,betis,beton,betot,betul,biadab,biak,biar,bias,biasa,biawak,biaya,bibit,bicara,bicu,bidah,bidai,bidang,bidan,bidas,bidik,biji,bikin,bilah,bilai,bilang,bilas,bimbang,bimbing,bimbit,bina,binasa,bincang,bindu,bingas,bingkah,bingkai,bingkas,bingkis,bingung,binjat,bintang,biola,biru,bisa,bisik,bising,bisnis,bisu,bisul,bius,bivak,blaster,blender,blok,blokade,blokir,bobok,bobol,bobos,bobot,bocah,bocor,bodoh,bodor,bohong,boikot,bokong,bola,bolak-balik,bolang,boleh,bolong,bolos,bolot,bombardir,bonceng,bondot,boneka,bongak,bonggol,bongkah,bongkar,bongkar-bangkir,bongmeh,bonsai,bonus,bonyok,bopong,bordir,boreh,borgol,borok,borong,boros,bosan,botak,boya,boyong,buah,buai,buak,bual,buana,buang,buas,buat,buaya,bubar,bubu,bubuh,bubuk,bubul,bubung,bubur,bubus,bubut,budak,budaya,budi daya,bugar,bugil,buhul,buih,bujang,bujet,bujuk,bujur,buka,bukan,bukit,bukti,buku,bukut,bulan,bulang,bulat,buldoser,bulu,bumbu,bumbun,bumi,bumi hangus,bumi rata,buncah,buncit,bundak,bundar,bundel,bungkam,bungkuk,bungkus,buni,buntang,bunting,buntu,buntung,buntut,bunuh,bunyi,bura,burai,buram,buras,burit,buron,buru,buruh,buruk,busa,busana,busuk,busung,busur,busut,buta,butir,butuh,buyar,buyur,pecah,pecah belah,pecak,pecal,pecat,pecut,peda,pedang,pedas,mediasi,pedih,medok,pedoman,peduli,megah,pegal,pegang,pegas,pegat,pegun,meja hijau,pejal,pejam,peka,pekak,mekar,pekat,pekau,pekik,peking,pekis,pekuk,pelan,pelana,lanting,pelas,pelaspas,pelawa,melayu,pelesat,peleset,pelet,peletek,pelihara,pelintir,pelisit,pelitur,pelonco,pelopor,pelorot,pelotot,peluk,lupuh,memar,memori,memorisasi,penasaran,penat,pencak,pencar,pencet,pencil,penda,pendak,pendam,pendar,pendek,pengap,pengaruh,pengat,penggal,mengkal,mengkis,pengkol,pengos,meni,pening,penjara,penjuru,pensiun,mentah,mental,pentang,pentas,mentega,pentil,penting,mentor,pentung,penuh,menung,pepah,pepak,pepas,pepat,peper,pepes,pepet,perah,merah,merah padam,perahu,perai,peram,perangah,perang,perangkap,peranjat,peran,perap,peras,rata,perawan,perban,percaya,percik,percit,merdeka,merek,merem,perengut,peretel,merger,pergi,pergok,pergol,hati,riah,perih,peri,periksa,perinci,peringis,peringkat,perintah,perisai,perkara,perkosa,perlahan,perli,perlu,permak,permisi,pernis,perogol,oleh,perosok,perosot,persekot,persekusi,persen,persepsi,personifikasi,persuasi,pertal,pertama,peruk,perum,perun,perusa,perut,pesam,pesan,pesat,mesin,pesona,pesong,mesra,pesta,mesti,pesuk,mesum,metabolisme,petah,petak,peta,petal,petang,meterai,petia,peti es,petik,peti,peting,petir,petuah,faal,fabrikasi,fadihat,faedah,fana,fanatik,fantasi,fasakh,fasih,fasilitas,fatwa,favorit,fermentasi,festival,fiat,fiber,figur,fiksi,filet,film,filter,filtrasi,finalisasi,final,firman,fitnah,fitrah,fluorinasi,fokus,formal,format,formulasi,forsir,fosil,foto,fotokopi,fragmentasi,fungsi,fusi,piagam,piala,pialang,piang,piara,piat,pica,picik,picing,picit,picu,pidana,pidato,pidi,migrasi,pihak,pijah,pijak,pijar,pijat,pijit,pikat,pikir,pikul,pilah,pilih,milik,pilin,pilis,pilot,pilu,mimpi,pimpin,pinang,minat,pincuk,pinda,pindah,pindah buku,pindah tangan,pindah tugas,pindai,pinggir,pingit,pingsan,miniatur,mini,minimalisasi,minimal,minim,pinjam,minta,pintal,pintar,pintas,pintur,minum,minyak,pipih,pipil,pipis,pipit,pirau,pirik,miring,miris,pisah,misai,misal,pisit,miskin,pistol,pita,pitar,mitigasi,piting,mitos,mitra,piuh,piutang,mobilisasi,poces,pocok,pocong,modal,moderator,modernisasi,modern,modifikasi,modulasi,pohon,pojok,pokok,pokrol,pola,poles,poligami,polisi,politik,politisasi,politisi,polok,pompa,pompong,moncong,pondok,pondong,pongah,monitor,monopoli,pontang-panting,ponten,popok,popor,populer,porah,porak-peranda,porak-poranda,porot,poser,posisi,positif,posting,postulat,potensi,motif,motivasi,potong,motor,potret,pabrikasi,cundang,kerja,abu,adab,adik,adu domba,adu,raga,alat,aman,amat,anak,angin,antara,rapat,api,apit,rasa,awak,babu,budi,cabang,cakap,cantik,capak,carut,cekak,cekcok,cekik,cepat,cerai,cermin,contoh,cuma,dagang,dahsyat,dakwa,dalam,damai,dapat,debat,dekap,dekat,dengar,dewa,diar,dua,rebut,edar,elok,rembuk,embun,empat,emping,renggang,erat,ganda,gandeng,ganding,ganduh,gantung,garah,gaul,gegas,gelar,gembira,gesek,giat,gilir,gontai,gosok,gulat,guna,gundah,gundik,gunjing,gurau,hadap,halus,hamba,hambat,harum,hebat,hias,hidup,hijau,hingga,hitung,hubung,hujan,huma,ikut,imbang,impit,indah,ringan,ingat,ingin,istri,jalan,jamu,janji,jarang,jauh,jelas,jerih,jodoh,jual beli,jual,juang,judi,jumpa,kaca,kacang,kacau,kali,kamu,kasar,kata,katup,kawan,kaya,kebun,kecuali,kedok,kelahi,kembang,kenal,kenan,kencang,kental,keras,keruh,ketat,kira,kirap,kitar,kokoh,konon,kotor,kuat,kuda,kukuh,labu,ladang,laga,lain,laki,lalai,lama,lambat,lancar,langkang,lapang,larat,lasah,lata,lawan,lebar,lebat,lekas,lelah,lelang,lelar,lemah,lembut,lengah,lenggek,lengkap,lepas,lezat,licin,lihat,limpit,lindung,lomba,longgar,luas,lunak,lurus,macam,permanen,muda,mudah,mulia,mulus,murah,niaga,olah,olok,parah,pelik,pukul,pupuh,putar,sabar,sahabat,sahaja,saing,sakit,saksi,salah,salin,sambung,sampah,sandang,sanding,sangat,sangka,sangkut,santai,santun,satai,satu,satu padu,saudara,sebar luas,sedap,sedia,sedikit,segar,segera,sekutu,selang,selendang,selir,selisih,seluk,semai,sembah,sempit,senang,senda,sendi,sengketa,senjata,setan,seteru,tuju,sewa,siang,siap,sila,silang,singgah,singkat,sisip,soal,solek,sua,suami,suatu,sudah,sudi,sukar,sulit,sumpah,sungguh,sunting,susah,tahan,tajam,takut,tali,tampan,tanak,tanding,tanggap,tangguh,tanggung jawab,tanggung,tangis,tanya,tapa,taruh,tarung,taut,tebal,tebar,tegang,tegas,teguh,tempur,temu,tenggang,tengkar,tentang,tetap,tiada,tidak,tiga,tikai,timbang,tinggi,tonton,topeng,tuan,tubi,tugas,tuhan,tukar,tumbuh,tunang,tunggang,tunjuk,turun,turut,tutur,ubah,ulur,rumah,rumit,umum,runcing,undi,runding,undung-undung,unik,untuk,urut,rusuh,utang,wali,wujud,yahudi,yakin,serta,plagiat,plaspas,plastik,plester,plombir,plontos,prakarsa,prakira,praktik,pranala,praperadilan,pratinjau,prediksi,presentasi,presto,pretel,pribadi,pribumi,prihatin,prioritas,privatisasi,produksi,produser,prognosis,program,proklamasi,promosi,propaganda,proporsional,prosa,proses,proteksi,protes,provokasi,proyeksi,publikasi,punya,muai,muak,mualaf,mual,muara,puasa,puas,muat,mubah,mubazir,pucat,pudar,mudik,pudi,pudur,mufakat,pugar,pugas,muhasabah,puing,puisi,puja,puji,pujuk,pujut,mukabalah,pukal,pukang,pukat,pukau,mukim,pukul rata,mula,mulai,pulang,pulas,pulasara,pulau,pulih,pulun,pulung,mulur,pulut,mumi,pumpun,munafik,punah,munajat,puncak,muncrat,muncul,pundi,mundur,punggah,punggal,punggung,punggur,pungkang,mungkar,pungkas,mungkin,mungkir,pungli,pungut,punjung,punjut,muntah,puntal,puntir,puntung,pupuk,pupur,pupus,puput,murajaah,mural,muram,murka,murni,murtad,puruk,murung,pusaka,pusar,pusat,museum,musikalisasi,musik,pusing,muskil,musnah,puso,mustahil,musuh,pusut,musyawarah,musyrik,mutakhir,mutalaah,putar balik,mutasi,puter,putih,mutilasi,mutlak,putra,mutu,putus,puyeng,puyu,vaksin,vaksinasi,vakum,validasi,valuasi,vape,variasi,verbal,verifikasi,veto,video,viral,virtualisasi,virtual,visi,visualisasi,visual,visum,vital,voli,vonis,taat,tabah,tabak,tabal,tabel,tabik,nabi,tabir,tablig,tabok,tabrak,tabuh,tabu,tabulasi,tabun,tabung,tabur,tadabur,tadah,tadbir,tafahus,tafakur,nafi,nafkah,tafsir,tagak,tagan,tagih,tahap,tahar,tahbis,tahkik,tahnik,tahu,tahun,naif,naik,naik kelas,naik turun,taja,tajak,tajin,najis,tajuk,takah,takak,nakal,takar,takbir,takdir,takdis,takhlik,nakhoda,takhsis,takhta,taki,takik,takjub,taklik,takluk,takma,takol,takrif,taksi,taksir,takuk,takung,takur,takwil,takzim,takzir,tala,talak,nalam,talang,nalar,talkin,nama,tamat,tambah,tambak,tambal,tambang,tambar,tambat,tambuh,tambul,tambun,tambung,tambus,tameng,tampak,tampal,tampang,tampar,tampas,tampel,tampi,tampik,tampil,tampin,tampon,tampung,tamsil,tamu,tamyiz,nanah,tanai,tanam,tanang,nanap,nanar,tancang,tancap,tanda,tandak,tandang,tandas,tanda tangan,tandem,nandong,tandu,tanduk,tandur,tandus,tangan,tangap,tangas,tanggal,tanggam,tanggang,tanggar,tangguk,tanggul,tanggulang,tangkal,tangkap,tangkar,tangkas,tangkil,tangkis,tangkuk,tangkul,tangkup,tangkup telentang,tangsel,tanjak,tanjul,tanjung,tanjur,tansi,tantang,nanti,tanwin,tapai,tapak,tapak tilas,napas,tapis,taplak,tapuk,tapung,tapus,taraf,tarah,tara,tarang,narasi,tarbiah,target,tari,tarif,tarik,tarikh,taris,tartil,tarum,tarup,tasak,nasakh,tasaruf,tasdik,tashih,nasihat,nasikh,nasional,nasionalisasi,nas,tasrif,tasyhid,tasyrih,tata,tatah,tatak,tatang,tatap,tatar,tatih,tating,tato,naturalisasi,natural,tauhid,taul,tauliah,taung,naung,taur,navigasi,tawak,tawan,tawar,tayang,tayang bincang,nazam,nazar,cabar,cabau,cabik,cabul,cabut,cacah,cacak,cacap,cacar,cacat,cacau,caci,cadai,cadang,cadar,caduk,cadung,cagak,cagar,cagil,cagun,cagut,cahar,cahaya,caing,cair,mencak,cakah,cakar,cakup,cakus,calak,calang,calar,calit,calo,calon,cambuk,camil,campak,campang,campung,campur,campur aduk,campur baur,camuk,camur,canai,canak,canang,cancang,cancut,candra,candu,cangah,cangak,cangam,cangar,cangcang,canggih,canggung,cangkel,cangking,cangklong,cangkok,cangkuk,cangkul,cangkum,cangkung,cangkup,canguk,cantel,canting,cantol,cantum,capai,caplok,capres,carah,carak,carang,cari,carik,caring,carter,caruk,catat,catek,catok,catu,catuk,catut,cawat,cebak,cebik,cebil,cebir,cebok,cebur,cecah,cecak,cecap,cecar,cece,cecer,cedera,cedok,cegah,cegat,cekah,cekal,cekam,cekau,ceker,cekih,ceking,cekit,cekok,ceku,cekuh,cekung,cekup,cekut,cela,celak,celaka,celang,celangak,celat,celempung,celeng,celep,celetuk,celik,celis,celuk,celung,celup,celur,celus,cema,cemar,cemas,cemat,cemburu,cemeeh,cemeti,cemooh,cemplung,cempung,cempurit,cemuk,cencang,cendekia,cenderung,cengam,cengang,cengap,cengis-cengis,cengkam,cengkelong,cengkeram,cengut,centang,centong,cepak,ceper,ceplok,ceplos,cepol,cepuk,cerabih,ceracam,ceracau,cerah,cerai-berai,ceramah,cerap,cerat,ceratai,ceratuk,cerca,cercah,cercap,cerdas,cerewet,ceria,cericip,cerita,cerkam,cerkau,cerlang,cerling,cermat,cerna,ceroboh,cerocos,cerowok,cerucup,ceruh,ceruk,cerup,cerut,cetai,cetak,ceteng,ceti,cetus,ciak,ciap,ciar,cibir,cibit,cicik,cicil,cicip,cicit,cido,ciduk,cilok,cina,cincang,cinta,ciplak,ciprat,cipta,ciri,cirit,cita,citra,cium,ciut,coak,coang,coba,coblos,cocok,cocol,cocor,codak,cogok,cokek,cokelat,coket,cokok,cokol,colek,coleng,colet,colok,colong,colot,comblang,comel,comot,concong,condong,conet,congak,conggok,congklang,congkong,congok,congol,sontek,conteng,copet,copot,corek,coreng,coret,corong,corot,cotok,cuai,cuar,cuat,cubit,cuca,cuci,cucuh,cucup,cucur,cucut,cugat,cuik,cuil,cuit,cukai,cukil,cukong,cukup,cukur,culak,culik,cumbu,cunam,cungap,cungkil,cungul,cupai,cupak,cupang,cupar,cuplik,curah,curai,curam,curang,curat,cureng,curhat,curi,curiga,curu,dabak,dabih,dabik,dabung,dacin,dada,dadak,dadar,daduh,daduk,dadung,daerah,daftar,daftar hitam,daga,dagel,dagi,daging,dahaga,dahak,dahan,dahulu,daif,daki,daku,dakwah,dalang,dalih,dalil,damah,damak,damar,damba,damik,dampak,dampar,dampil,damping,damprat,dana,danau,dandan,dangdut,dangir,dangkal,dangkar,dangkung,danguk,dapuk,darab,darah,daras,darat,daring,darmabakti,darurat,dasar,dasun,data,datang,datar,daulat,daun,dawat,dawuh,daya guna,daya upaya,dayu,dayung,dayus,deaerasi,debah,debar,debarkasi,debas,debik,debit,debu,debur,debut,decak,decap,decit,decur,dedah,dedas,dedau,dedel,deder,dedes,dedikasi,definisi,deflagrasi,defleksi,defoliasi,defragmentasi,degam,degil,degradasi,deham,dehumanisasi,dekam,dekar,deklamasi,deklarasi,dekolonisasi,dekomposisi,dekonstruksi,dekor,dekorasi,dekret,dekus,dekut,delegasi,delegitimasi,delik,delong,demah,demik,demiliterisasi,demo,demobilisasi,demokrasi,demonstrasi,dempet,dempul,denda,dendam,dendang,dendeng,denging,dengki,dengking,dengkleng,dengkul,dengkung,dengkur,dengkus,dengu,denguk,dengung,dengus,dengut,dentang,denting,denyut,depa,depak,depang,depolitisasi,deponir,deportasi,deposito,depresiasi,deprok,depun,dera,derai,derak,deram,derang,derap,deras,derau,derek,derep,deres,deret,dering,deris,derit,derita,derivasi,derma,deru,derum,desah,desain,desak,desakralisasi,desalinasi,desar,desas-desus,desau,desentralisasi,desing,desir,desis,deskripsi,destabilisasi,desus,desut,detail,detak,detap,detar,detasir,deteksi,detik,devaluasi,devosi,dewasa,dewata,diagnosis,dia,dialog,diam,diang,dian,diat,didih,didik,didis,digdaya,digital,digul,dikotomi,diksi,dikte,dilak,dinamis,dinamit,dinas,dinding,mending,dingin,diris,dirus,diseminasi,disiplin,diskon,diskonto,diskredit,diskriminasi,diskualifikasi,diskusi,dispersi,displai,disposisi,disrupsi,distilasi,distorsi,distribusi,diversifikasi,divestasi,doa,dobel,dobrak,dodal,dodet,dodol,dodong,dodos,dogma,doktor,doktrin,dokumen,dokumentasi,dolar,dolim,domestik,dominan,dominasi,dompak,dompleng,donasi,doncang,dondang,donder,dondon,dongak,dongeng,dongkak,dongkel,dongkol,dongkrak,dongsok,dorna,dorong,dosir,doyong,drainase,drama,dramatisasi,dramatisir,dramatis,dribel,dubes,dubing,dublir,duda,dudu,duduk,dudur,duga,dugal,dugang,dugas,dukacita,duka,dukung,dukun,dulag,dulang,dulu,dungas,dungu,dunia,duniawi,dupa,dupak,duplikasi,duplikat,durap,durhaka,duri,durjana,duru,dusin,dusta,dwiganda,teater,tebah,tebak,teban,tebang,tebas,tebat,tebeng,tebing,tebok,tebu,tebuk,tebus,teduh,tegah,tegak,tegap,negara,tegar,negasi,negatif,teger,negosiasi,teguk,tegun,tegur,teja,tekad,tekak,tekan,tekang,tekap,tekat,tekek,tekel,teken,teker,tekik,tekuk,tekun,tekur,telaah,telabang,teladan,telah,telan,telangkai,telangkup,telanjang,telantar,telap,telaten,teledor,telegram,telempap,teleng,telentang,telepon,telik,telikung,telinga,telisik,teliti,teluh,tungkup,telur,telus,telusuk,telusur,telut,telutut,teman,tembaga,tembak,tembang,temberang,tembis,tembok,tembuk,tembung,tembus,temin,tempa,tempah,tempap,tempat,tempel,tempelak,tempeleng,tempias,tempik,tempil,templek,templok,tempoh,tempong,tempuh,tempuling,tempurung,temu duga,temu kenal,tenaga,tenang,tenar,tendang,tendas,tender,nenes,tengadah,tengah,tengara,tenggak,tenggala,tenggara,tenggek,tenggelam,tengil,tengkarap,tengkel,tengking,tengkurap,tengok,tenok,tensi,tenteng,tenteram,tentu,tenun,tenung,tepak,tepam,tepas,tepat,tepek,tepi,tepik,tepis,tepuk,tepung,tepung tawar,tera,teraju,neraka,teral,terampil,teran,terang,terang jelas,terap,terapi,teras,teratak,teratap,terau,terawang,terbang,terban,terbit,teriak,terika,terik,terima,terindil,terjang,terjemah,terjun,terka,terkam,terkap,terkup,terna,ternak,terobos,terok,teroka,terombol,teropong,teror,terpa,tawa,tertib,terum,terungku,terus,tetak,tetal,tetar,tetas,tetek,tetes,netralisasi,netral,tewas,aba-aba,abadi,abah,abai,abar,kabar,ngabat,abdi,aben,ngaben,abet,kabir,abis,kabit,abjad,ablasi,abolisi,aborsi,abrasi,absah,absen,absolut,absorb,absorpsi,abstrak,abstraksi,abuk,kabul,kabung,kabur,kabut,acah,kacak,acan,acap,kacar,acara,kacau balau,aceng,aci,aci-aci,kacip,kacir,aco,acu,acuh,acum,acung,ada,adak,kadal,kadang,adang,adaptasi,kadar,kadas,adat,adati,adegan,adem,kader,adil,kadim,administrasi,admisi,adon,adopsi,adres,adsorpsi,aduh,aduk,adun,advokasi,aerasi,aerosol,kafan,afdruk,afiat,afiliasi,kafir,afirmasi,afkir,agah,agak,agak-agih,aga,agama,agan,agas,agenda,agen,kaget,agih,agitasi,agregasi,agresi,agul,kagum,agung,agun,agut,ahad,ahli,aib,kaidah,kail,air,kais,kait,ajaib,ajak,kajang,kaji,ajuk,aju,ajun,kakak,akal,akan,kakap,akar,kakas,akhir,kaki,akibat,akikah,akod,kakok,akomodasi,akomodir,akrab,akreditasi,akresi,akronim,akselerasi,aksentuasi,aksep,akses,aktif,aktivasi,aktualisasi,aktual,kaku,aku,akuisisi,akulturasi,akumulasi,akurasi,akur,kalah,alah,kalai,alamat,alam,kalang,alang,alap,alas,kalawang,alem,kaleng,ali,ali-ali,kalicau,alienasi,alih,alih aksara,alih bahasa,alih daya,alih fungsi,alih suara,alih tugas,alih wahana,kalimantang,kalimat,alin,aling,alir,alit,kalkulasi,alokasi,alpa,kalsinasi,alum,alun,kalung,alup,alur,kalut,kalut malut,amal,amanah,amanat,amang,amar,ambai,ambak,ambal,kamban,kambang,ambang,ambau,ambek,ambek paramarta,kambi,ambil,ambin,kambing hitam,ambruk,ambul,ambung,ambur,amen,amendemen,kamera,amin,kamit-kamit,am,amnesti,amonifikasi,amortisasi,ampai,kampanye,kampas,ampelas,amplifikasi,amplop,ampu,kampuh,ampuh,ampul,ampun,kampung,amput,amputasi,kamuflase,amuk,amunisi,kamus,anak emas,anak tiri,analisis,analogi,kanan,anatomi,ancai,ancak-ancak,ancam,ancang,ancar-ancar,kancing,ancuk,andai,andak,andal,andam,kandang,kandar,kandas,kandidat,anduh,kandul,kandung,kandut,aneh,aneka jenis,aneka,aneka ragam,aneksasi,anestesi,nganga,angan,kangen,anggal,anggap,anggar,anggit,angglap,anggrek,angguk,anggul,anggung,anggur,anggut,angka,kangkang,angkasa,angkat,angker,angkit,angkop,angkup,angkut,anglap,anglong,angon,angop,angsu,angsur,angut,ani,aniaya,animasi,anjak,anjal,anjang,anjar,kanji,anjik,anju,anjung,anjur,anonim,anotasi,kansel,antamir,kantang,antap,antar,antep,antih,antik,anting,antisipasi,kantong,kantor,antre,kantuk,antuk,antul,anugerah,anulir,anut,kanvas,anyam,anyang,kaok,mengap,apa,kapah,kapak,kapal,apam,kapar,apartemen,kapas,apik,kapitalisasi,kapitalis,kapital,kapitulasi,apkir,aplikasi,kaplok,aplus,kapok,apresiasi,aprit,kapsul,kapten,apung,kapur,arab,arah,arak,karam,karamel,karang,arang,aransemen,karantina,aras,karat,karau,karbida,karbol,karbon,ares,karet,ari,karib,arif,karih,arih,arik,karincang,arit,aron,arsip,arsir,arti,artikel,artikulasi,kartu,kartu merah,karu,aruk,arun,arung,karung,karunia,arus,arus utama,karut,arwah,karya,asa,kasad,asah,asak,asal,kasam,asam,asap,asas,kaset,asi,kasidah,kasih,kasim,asimilasi,asing,asin,asisten,aso,asong,asosiasi,aspal,kasrah,asrama,kastrasi,asuh,asumsi,asung,asup,asuransi,kasus,asyik,atak,katalis,katalisasi,katalisis,katalisit,katalog,atap,atar,atas,atas nama,kategori,kati,atomisasi,atom,atribut,katrol,katung,atur,atus,audisi,audit,kaul,aum,aung,aur,aus,kaus,kaut,autopsi,kaveling,awabeku,awahama,awai,awakutu,kawal,awalengas,awam,kawang,awas,awat,kawat,awet,awet muda,kawih,kawin,awur,kayai,ayak,ayap,kayau,ayom,kayu,kayuh,ayum,ayun,ayut,azab,azam,azan,ke atas,kebal,eban,bang,kebas,kebat,ke bawah,bel,ke belakang,kebiri,bis,blog,bom,bon,bor,buk,ke bumi,kebur,kebut,kecam,kecambah,kecap,cap,cas,cat,kecek,cek,keceng,ecer,kecewa,kecimus,kecipir,kecoh,cor,kecrek,kecu,kecup,kecut,dab,kedai,kedang,kedap,kedau,dep,depan,ke depan,kedik,kedip,edit,editorialisasi,dor,dot,drel,dril,drop,dub,keduk,edukasi,dum,dup,kedut,efektif,efektivitas,efisien,egah,gas,egat,gay,gel,egol,gol,gong,egos,gung,eja,kejai,kejam,kejan,ejan,kejang,kejap,kejar,ejawantah,ejek,keji,jreng,kejuju,jus,kejut,kekah,kekal,kekang,kekar,kekas,kekeh,kekek,keker,kir,klaim,klir,klop,kol,ekonomi,kop,ekor,kos,ekranisasi,eksamen,eksekusi,eksisi,eksis,eksklusi,eksklusif,ekskresi,eksorsis,ekspansi,ekspedisi,ekspektasi,eksploitasi,eksplorasi,ekspor,ekspos,ekspresi,eksternalisasi,eksternal,ekstrak,ekstraksi,kelabang,elaborasi,kelabu,keladau,kelah,kelai,lak,elak,kelam,kelamin,kelana,kelanjar,kelantang,lap,kelap,kelar,kelarai,las,kelas,kelat,kelebat,kelebek,kelebu,elektrifikasi,kelelot,lem,kelenang,kelenggara,kelepai,kelepat,kelepik,kelepur,kelesot,ketak,kelibat,kelih,kelik,kelikik,lik,keliling,kelim,eliminasi,keling,kelip,kelir,keliru,kelis,kelit,elite,kelocak,kelodan,kelok,kelola,kelompok,elon,kelon,kelopak,los,kelosok,kelotok,keloyor,elu,keluan,keluar,keluh,keluk,kelumun,kelupas,kelupur,elus,keluyur,kemam,emansipasi,kemas,emat,kembali,emban,kembang biak,kembara,embargo,kembar,embat,embel,kembeng,embik,kembol,kembung,kembur,embus,embut,kemendang,kemis,emoh,emol,emong,kempa,empang,empap,empar,empas,empenak,empeng,emper,empik,kempis,kempit,kemplang,empo,empoh,empos,prit,empu,empuk,kempul,kemu,kemudi,kemudian,muka,ke muka,kemul,emulsi,kemut,kena,kenang,enap,ngenas,encang,kencan,encer,kencing,kencong,kencreng,endal,kendala,kendali,kendana,kendang,endap,kendara,endon,kendong,endoskopi,kendur,kenduri,endus,energi,enes,enggan,engget,engkang,kengkeng,engkol,enjak,enjal,enjut,enkripsi,kenong,kensel,entak,kentara,entas,enten,enteng,entit,entot,entri,kentut,kenur,enyah,enyak,kenyal,kenyam,kenyang,kenyit,kenyut,ngeong,kepah,pak,kepak,epak,kepal,kepala,pan,kepang,pas,pel,per,kepil,keping,kepit,keplak,kepoh,pos,kepot,kepras,keprek,pres,kepris,kepruk,kepuh,kepuk,pul,kepul,kepung,kerabik,kerabu,kerah,kerai,kerak,kerakah,kerakal,erak,keram,keramas,keramat,eram,keramik,erang,kerangka,kerangkeng,kerap,kerat,kerawang,kerbuk,kercing,kercit,kerdil,kerdom,kerebok,kereceng,ereh,kerek,rem,keremus,ereng,kerenyot,kerepas,kerepes,eret,keri,keriap,kericau,kerih,kerik,ngeri,kerikil,kerikit,kering,keringat,kerinjang,kerip,keriput,keris,kerisik,kerising,kerit,keriting,kerjang,kerjap,kerkah,kerkau,kerlap,kerling,kerlip,kernai,kernet,kernyih,kernying,kernyit,kernyut,kerobek,kerodong,kerok,kerokot,rol,keroncong,keropeng,keropos,kerosi,kerosong,erot,keroyok,kerpus,kersik,kertak,kertang,erti,kerubung,kerubut,kerucut,keruk,kerukut,kerul,kerumit,kerumuk,kerumun,kerumus,keruntung,kerut,kerutak,kesah,sah,kesak,esa,kesal,ke samping,kesan,kesang,kesat,kesek,kesel,set,sini,kesip,sir,sisi,eskalasi,esok,sol,som,sop,kesot,esot,esterifikasi,estetik,estimasi,kesumba,sun,sup,ketam,ke tanah,etanol,tap,teh,ketek,tem,keteng,ke tengah,ke tepi,tes,ketes,keti,tik,ketil,tim,keting,tip,ketis,ketok,top,tos,trek,tren,ketrok,etsa,tua,ketuk,ketul,tum,twit,evakuasi,evaluasi,evaporasi,vlog,evolusi,wol,eyel,gaba-gaba,gabai,gabak,gabas,gabruk,gabung,gabus,gacok,gada,gadai,gadang,gading,gadis,gado,gaduh,gaduk,gaet,gagah,gagai,gagal,gagap,gagas,gagau,gaham,gahar,gaib,gairah,gait,gaji,galah,galak,galang,galas,galau,gali,galib,galur,gamak,gamat,gambang,gambar,gamik,gamit,gampang,gampar,ganas,gancu,gandar,gandrung,gandul,gandung,ganggang,ganggu,ganggut,gangsi,gangsir,ganja,ganjak,ganjal,ganjar,ganjil,ganjur,gantang,gantel,ganti,gantih,gantol,ganyah,ganyang,gaok,gapai,gapil,gapit,gaplok,garang,garap,gari,garis,garis bawah,garit,garong,garpu,garu,garuk,garung,garut,gasab,gasak,gasing,gatra,gaung,gawang,gawat,gaya,gayuh,gayuk,gayun,gayung,gayut,gebah,geblak,gebok,gebos,gebot,gebrak,gebu,gebuk,gebyah-uyah,gebyur,gecar,gecek,gedor,gegar,geger,gejala,gejolak,gejos,gejuju,gelabur,geladrah,gelak,gelalar,gelamai,gelambir,gelandang,gelandot,gelanggang,gelangsar,gelantang,gelanting,gelap,gelas,gelasah,gelasak,gelasir,gelatak,gelatuk,gelebar,geleber,gelecik,geledah,geledang,geledek,geleding,geledur,gelegak,gelek,gelekak,gelekek,gembung,gelembur,gelendong,gelendot,geleng,gelenting,gelenyar,gelepai,gelepar,gelepek,gelepur,geleser,gelesot,geletak,geletar,geletik,geletis,geletuk,geli,geliang,geliat,gelibir,gelicik,geligi,geligis,geligit,gelimang,gelimantang,gelimpang,gelimun,gelincir,gelinding,gelinjang,gelintar,gelinting,gelisah,gelitar,gelitik,gelobok,gelodar,gelogok,gelombang,gelompar,gelongsor,gelontor,gelopak,gelora,gelosang,geloso,gelotak,geloyor,gelugut,gelulur,gelundung,gelung,gelup,gelupur,gelut,gema,gemak,gemal,gemar,gemas,gembala,gembar-gembor,gembel,gembleng,gembok,gembol,gembos,gembur,gembut,geretak,gerincing,gemik,gempa,gempar,gempita,gempur,gemuk,gemulai,gemuruh,genang,genap,gencar,gencat,gencet,gendak,gendam,gendeng,gender,gendong,gendut,generalisasi,genggam,genjot,genta,gentar,gentas,gentayang,gentel,genting,gepit,gepok,geprak,gera,gerabak,geragai,geragap,geragas,geragau,gerai,gerak,geram,geramus,gerang,gerantak,gerantang,geranyam,gerapai,gerat,gerawat,gerayah,gerayang,gerbak,gerbang,gerbus,gerebek,gerecak,gerecok,gereh,gerek,geremet,gerendel,gerendeng,gerenik,gerenyet,gerepe,gerepek,gerepes,geresek,geret,geretang,gergaji,geriak,geriap,gericau,geridip,gerinda,gerinjam,gerinyau,gerisik,gerlap,gerlip,germang,germut,gero,gerobok,gerocok,gerodak,gerogot,gerojok,gerombol,gerombong,gerompok,geronggang,geropyok,geros,gerowot,gerpol,gersang,gertak,geru,gerugut,geruh,geruit,gerumit,gerumuk,gerumut,gerundel,gerung,gerun,gerunyam,gerupis,gerupuk,gerus,gerutu,gerutup,gesa,gesel,geser,gestur,getah,getang,getap,getar,getik,getil,getok,getu,gibah,gibang,gidik,gigih,gigil,gigis,gigit,gila,gilap,gilas,gili,giling,gimbal,gincu,ginjal,gintir,girang,giring,giris,gisar,gisil,gites,gitik,giur,glasir,global,glorifikasi,gobak,gobek,gocek,gocoh,goda,godak,godam,godok,godot,goel,goes,gogoh,gogok,gojlok,golak-galik,golek,goleng,golok,golong,gombal,gombeng,gondel,gondok,gondol,gonggong,gongseng,gonjak,gonjok,gonta-ganti,gonyak,gonyeh,gonyel,gonyoh,gorek,goreng,gores,gorok,gosip,gosong,gotes,gotong,gowes,goyah,goyak,goyang,gradasi,gramatikal,granat,gratak,gratis,graver,grosir,gual,guar,gubah,gubal,gubel,gubit,gubris,gudang,gugah,gugat,gugu,guguh,guguk,gugup,gugur,guit,gula,gulai,guling,gulir,gulud,gulung,gulut,gumal,gumam,gumbuk,gumpal,gumul,guna-guna,guncang,gunduk,gundul,gunggung,gunting,guntung,guntur,gunyam,gurah,guram,gurat,gurdi,gurik,gurit,gurita,guruh,guru,gusah,gusar,gusel,gusrek,gusur,gutik,guyur,hablur,hadiah,hadir,had,hafal,hajar,hajat,haji,hak,hakim,hala,halai-balai,halal,halang,halau,haluan,hambur,hamil,hampa,hampar,hampir,hamun,hanca,hancur,hancur lebur,hancur luluh,handel,hangat,hangus,hantam,hantar,hantu,hanyut,hapus,harakat,haram,harap,hardik,harga,harimau,harmoni,harmonisasi,harmonis,haru,haru biru,harus,hasad,hasil,hasrat,hasta,hasud,hasut,haus,hawa,hayat,heban,heboh,hegemoni,hela,helat,hemat,hembalang,hempap,hempas,hendak,hening,hentak,heran,hewan,hibah,hibur,hidang,hidayah,hidrasi,hidrogenasi,hidrolisis,hidroponik,hidu,hidung,hierarki,hijab,hijrah,hikayat,hilang,hilir,himbau,himpun,hina,hina dina,hinap,hindar,hindu,hinggap,hinggut,hipnosis,hipotesis,hirap,hirau,hiruk,hirup,hisab,hitam,hitam putih,hitam legam,homogen,homo,honor,hormat,hujan angin,hujan panas,hujat,hukum,hulu,huni,hunjam,hunus,hutan,kiah,ia,kial,ngiang,iap,kias,kiat,iba,kibar,ibarat,kibas,ibing,kiblat,ibrah,ibrit,kibul,icip,kicu,idah,idam,idap,idas,idealisasi,ideal,identifikasi,identik,idola,idu,kidung,igal,igau,ihtimal,ijabah,ijab,kijing,ijmal,ijuk,ikal,ikat,ikhlas,ikhtiar,ikhtisar,kikik,kikir,kikis,iklan,ikrar,iktikad,iktiraf,ikut serta,kilah,ilai,kilan,kilang,kilap,ilar,kilas,kilat,kilau,iler,iles,ilham,kili,kilik,iling,kilir,ilmiah,ilmu,kilo,ngilu,iluminasi,ilusi,ilustrasi,imaji,imajinasi,imak,imam,iman,kimbah,imbak,imbal,imbas,imbau,imbit,imbuh,imigrasi,iming-iming,imitasi,imkan,imla,kimpal,impas,impersonasi,impi,implan,implantasi,implementasi,implikasi,implisit,impor,impresi,improvisasi,kimpus,imunisasi,imun,inai,kinang,inang,inap,kincah,incar,kincau,incit,incrit,kincup,indang,indekos,indeks,inden,indik,indikasi,inding,indoktrinasi,indonesia,indra,indraja,induk,induksi,indung,industrialisasi,industri,infak,infeksi,inferensi,infiltrasi,inflamasi,infleksi,info,informasi,infus,infusi,ingar,ingau,inggris,ingkar,ingsar,ingsut,ingus,kini,inisial,inisiasi,injak,injap,injeksi,injil,inklusi,inkorporasi,inkubasi,inkuiri,inokulasi,inovasi,inpres,input,insaf,insan,inseminasi,inset,insinuasi,insisi,inspeksi,inspirasi,instal,instan,institusi,instruksi,insulasi,intai,integrasi,intensifikasi,intensif,intens,interaksi,interferensi,interkoneksi,interlokal,intermeso,internalisasi,internasional,internir,interogasi,interpelasi,interpolasi,interpretasi,interupsi,intervensi,interviu,kintil,intim,intimidasi,intip,inti,introduksi,introspeksi,intrusi,invasi,inventarisasi,investasi,investigasi,ion,kipai,kipas,kiprat,iprit,ipuk,kirab,kirai,irama,iras,kiri,kirik,kirim,iring,iris,irit,iritasi,kisa,kisah,kisai,isap,kisar,kisas,kisat,isbat,iseng,isi,kisik,islah,islamisasi,islam,isolasi,isoman,kisruh,istiadat,istigfar,istikmal,istilah,istimewa,istirahat,isu,kisut,isyarat,kitik,iur,iya,izin,khalayak,khalifah,khamir,khasiat,khas,khatam,khawatir,khayal,khianat,khitan,khitbah,khotbah,khusus,khusyuk,khutbah,klakson,klarifikasi,klasifikasi,klasik,klem,klik,klimaks,klip,kliping,kliring,klise,klona,kluster,koagulasi,kobar,kocar-kacir,kocok,kode,kombinasi,kompensasi,komunikasi,kondisi,konfirmasi,konsolidasi,konsultasi,konsumsi,kontribusi,koordinasi,kotak,kreasi,kreatif,kredit,kremasi,kriminalisasi,kriminal,krisis,kristal,kristen,kritik,kritis,kurasi,obat,obeng,objek,objektif,kobok,obor,obral,obras,obrol,observasi,obsesi,obstruksi,kocak,oceh,kocong,kocor,kodifikasi,kodok,odol,ogah,ogam,ogel,kognisi,ogok,koherensi,oja,ojek,ojok,kokang,kokol,kokot,oksidan,oksidasi,okupasi,kolaborasi,olak,olak-alik,olang-aling,kolaps,kolase,oleh-oleh,olek,koleksi,kolektivisasi,oleng,oles,olet,kolonisasi,oman,komandan,komando,ombak,ombang-ambing,omel,komentar,komersial,komidi,komisi,omong,kompak,kompaksi,kompas,kompes,kompilasi,komplain,komplemen,komplet,ompol,kompor,kompos,komposer,komposisi,komposit,ompreng,kompres,kompresi,kompromi,omprong,komputasi,komputerisasi,komputer,komunis,konan,onani,onar,oncek,konde,kondensasi,ondok,konduksi,kondusif,koneksi,konferensi,konfigurasi,konfrontasi,onggok,ongkang,ongkok,kongkong,ongkos,konjugasi,konkret,konotasi,konsekrasi,konsekuensi,konseling,konsentrasi,konsep,konsepsi,konseptualisasi,konservasi,konsisten,konsistensi,onslah,konstatasi,konstatir,konstitusi,konstriksi,konstruksi,konsul,kontak,kontaminasi,kontan,konteks,kontekstual,konten,konter,kontrak,kontraksi,kontras,kontrol,kontur,konvensi,konvergensi,konversi,onyah-anyih,onyok,onyot,kooptasi,opak,opak-apik,kopek,opelet,open,oper,operasi,operasional,kopi,opini,oplos,oposisi,koprek,optimal,optimum,kopyok,orak,orak-arik,koral,orang,koran,orasi,orat-oret,korban,orbit,order,kored,korek,koreksi,korelasi,koreografi,oret,koret,organisasi,orientasi,orkestrasi,ornamen,orok,orok-orok,korting,korup,korupsi,kosek,kosong,ospek,kota,otak-atik,kotak-katik,otak,ngotek,kotes,otomatis,otonomi,otot,oven,kover,oyak,koyak,oyok,ngoyos,qada,qasar,kuah,uak,kuak,kualifikasi,uang,uan,kuantifikasi,uap,uar,kuar,kuasa,ubah suai,kubak,uban,ubang,kubang,ubar,ubek,uber,kubik,ubin,kubit,ubit,ubrak-abrik,kubra,ubub,kubu,ubung,kubur,kubus,kucai,kucak,ucap,kucar-kacir,ucek,kucek,kucil,kucir,kucup,kucur,udak,kudang,kudap,udar,udara,udek,kudeta,kudian,kudung,kudus,udut,uek,kufur,ugem,ugut,uik,kuis,uis,uit,ujar,uji,ujud,ujung,kujut,ukir,ukup,ukur,kukus,kulak,ulang,ular,ulas,ulek,ulem,ulen,ules,uli,kuliah,ulik,ulir,ulit,kulit,ultimatum,kultur,kultus,kulub,kulum,kumai,kumal,uman,kumandang,kumbah,umban,umbang,umbang-ambing,umbar,umbuk,umbut,umpak,umpama,umpan,kumpar,umpat,umpet,umpil,kumpul,umrah,kumuh,umun,kunci,kuncup,kundai,undak,undang,unduh,undur,ungam,unggah,unggas,unggis,unggul,unggun,unggut,ungkah,ungkai,kungkang,ungkap,ungkat,ungkep,ungkil,ungkit,kungkung,ungsi,kuning,universal,ngunjal,unjuk,unjun,kunjung,unjung,unjur,unjut,untai,untal,until,unting,untir,kuntit,kuntum,untung,kunyah,unyai,upa,upacara,upah,upak,upam,upar,kupas,upaya,upil,kuping,urah,urai,kurang,urap,uras,kurator,urbanisasi,kurban,kuret,urgensi,uri,urik,urinasi,urip,kursus,uruk,kurung,urung,urup,urus,kusa,usaha,usai,usak,kusal,usang,usap,usik,usil,usir,kusruk,kusta,ustaz,kusuk,usul,usung,usut,kusut,utak-atik,kutak,utama,utara,utas,kuti,kutik,utik,kutil,utilitas,kutip,kutub,utuh,kutu,kutuk,kutung,utus,kuyup,uzlah,tiang pancang,tian,tiap,tiarap,niat,tidur,tigari,tigas,nihil,tika,nikah,tikam,tikas,nikmat,tikungan,tikus,nilai,tilang,tilap,tilik,timang,timba,timbal,timbau,timbel,timbrung,timbuk,timbul,timbun,timbus,timpa,timpal,timpang,timpuk,timur,ninabobo,tindak,tindak lanjut,tindan,tindas,tindih,tindik,tinggal,tinggam,tinggung,tingkah,tingkap,tingkar,tingkat,ningrat,tinjau,tinju,tinta,tinting,tipis,tipu,tirakat,tiris,tiru,tirus,nisbah,nisbi,niscaya,tisik,nista,titah,menit,titar,titi,titik,titik berat,titip,titir,titis,titrasi,tiup,tiwah,jabal,jabar,jabat,jadi,jadwal,jaga,jagal,jago,jagung,jahanam,jahar,jahat,jahil,jahit,jail,jaja,jajah,jajak,jajal,jajar,jala,jalang,jalar,jalin,jalu,jamah,jamak,jambak,jambret,jamin,jampi,jampuk,jamur,janda,jangak,jangan,jangat,janggal,jangka,jangkah,jangkang,jangkar,jangkau,jangki,jangkit,jangol,jantang,jantan,jantung,jantur,japri,jara,jarah,jarak,jaram,jaras,jari,jaring,jarit,jarum,jatah,jatuh,jawab,jawat,jawi,jawil,jebak,jeblos,jebluk,jebol,jebor,jebrol,jebur,jedot,jegal,jegil,jejak,jejal,jelajah,jelanak,jelang,jelangak,jelar,jelau,jelejeh,jelek,jelempah,jelengar,jelepak,jelepok,jelih,jelijih,jelimet,jelimpat,jeling,jelir,jelit,jelma,jeluak,jelujur,jelum,jelungkap,jelunut,jelus,jelut,jemaah,jemba,jembak,jembatan,jempalit,jemput,jemu,jemur,jenak,jenang,jendal,jeneng,jengek,jengguk,jenggut,jengit,jengkal,jengkang,jengkel,jengkelit,jengkeng,jengket,jengking,jengkit,jengkolet,jengkot,jenguk,jengul,jenis,jenjang,jentik,jenuh,jepit,jeprat,jepret,jeput,jerahap,jera,jeramah,jerambah,jerang,jerangkak,jerangkang,jerap,jerat,jeraus,jerba,jerbak,jeremba,jerembap,jerempak,jereng,jeriau,jerit,jerkah,jernih,jerojol,jerongkok,jerongkong,jeruk,jerukun,jerukup,jerum,jerumat,jerumus,jerungkau,jerungkis,jerungkung,jetis,jewer,jidar,jijik,jijit,jilam,jilat,jilbab,jilid,jimak,jimbit,jimpit,jinak,jingap,jingau,jingu,jinjing,jinjit,jiplak,jirus,jitak,jitu,jiwa,jiwit,jodong,joget,jojol,jolak,jolek,jolok,jolong,jolor,jomlo,jompak,jompo,jonget,jongkang,jongkeh,jongos,jonjot,joreng,jorok,jotos,juah,juak,juara,jubel,jublek,judul,jujah,juju,jujuh,jujur,jujut,julai,julang,julat,juling,juluk,julur,jumbai,jumlah,jumput,junam,jungat,jungkal,jungkar,jungkat,jungkir,jungkir balik,jungkit,jungur,junjung,juntai,jura,juri,juru,juru bahasa,juru bicara,jurus,justifikasi,tobak,tobat,noda,todong,togan,togel,tohok,tohor,tokak,tokoh,tokok,tokong,tolak,toleh,tolerir,toleransi,tolok,tolong,tomang,tombak,tombok,nominal,nominasi,nomor,nonaktif,tonggak,tonggok,tongkah,tongkat,tongkrong,tongol,tonjok,tonjol,nonong,topang,topek,topi,topik,toreh,norma,normalisasi,normal,torpedo,tortor,total,notasi,totok,novel,towel,toyor,traktir,traktor,transaksi,transfer,transformasi,transmisi,transplantasi,sabotase,sadap,sadar,sahih,sejahtera,servis,sia-sia,siasat,sikap,simbol,simulasi,sinergi,sinkron,sinyalir,skala,skedul,skema,skenario,skeptis,sketsa,skor,skors,skrip,slogan,smes,smokel,somasi,sortir,sosialisasi,spekulasi,spesial,spion,sponsor,stabilisasi,stabil,standar,staples,starter,statis,status,stempel,stensil,stereotipe,steril,stigma,stigmatisasi,stilir,stimulasi,stimulus,stok,stop,strata,stratifikasi,struktur,subsidi,suci,sugesti,sukses,swasta,syafaat,syair,syak,syarah,syarat,syariat,syarikat,syirik,syukur,syur,mentang,tradisi,transfusi,transitif,transkrip,transkripsi,transliterasi,translokasi,transmigrasi,transmigrasi lokal,transmutasi,transpor,trompet,tuah,tuai,tual,tuam,tuang,tuan rumah,tuas,tuba,tubruk,nubuat,tubuh,tuding,tuduh,tudung,tugal,tugas karya,tugur,tuhmah,tuil,tujah,tujuh bulan,nujum,tukai,tukam,tukang,tukas,tukik,nukil,tukul,tulah,tulang,tular,tuli,tulis,tulup,tumang,tumbal,tumbang,tumbuk,tumis,tumpah,tumpang,tumpang sari,tumpas,tumpat,tumpil,tumplak,tumpu,tumpuk,tumpul,tumpur,tunai,tunas,tunda,tunduk,tundung,tungau,tunggak,tunggal,tunggang-langgang,tunggik,tungging,tunggu,tunggul,tungkai,tungkul,tungkus,tunjal,tunjam,tunjang,tuntas,tuntun,tuntung,tuntut,tunu,turap,turba,turiang,turis,turus,nusantara,tusir,tusuk,nutrisi,tutuh,tutuk,tutul,tutup,tutus,saba,sabak,sabat,sabda,sabet,sabit,sablon,sabot,sabu,sabuk,sabun,sabung,sabur,sadai,sadau,sadik,sadran,sadu,sadur,safari,sagang,sagar,sagu,sahap,sahut,sajak,saji,sakal,sakap,sakar,sakat,sakelar,sakral,sakti,saku,nyala,salah arti,salah guna,salai,salak,salam,salang,nyalang,salat,saleh,salep,salib,salip,salir,salju,salon,saluir,salur,salut,samak,saman,nyaman,samar,sama rata,sambal,sambalewa,sambang,sambar,sambat,sambi,sambil,sambil lalu,sambit,sambuk,sambut,samir,sampai,sampak,sampang,samper,samping,sampir,sampo,sampu,sampuk,sampul,samun,nyana,sanak,sanda,sandar,sandera,sandi,sandiwara,sandung,sangai,sangan,sangga,sanggah,sanggam,sanggang,sanggep,sanggerah,sanggit,nyanggong,sanggrah,sanggul,sanggup,sangkak,sangkal,sangkar,sangkut paut,sangling,sangon,sangrai,sangsang,sangsi,sangu,sanitasi,sanjung,sanksi,santak,santan,santap,santet,santri,santung,nyanya,nyanyah,nyanyi,nyanyu,sapa,sapih,sapu,saput,sara,saraf,sarak,sarana,sarang,saran,sarap,sarasehan,sarat,sarau,sari,saring,nyaring,sari pati,saron,saru,saruk,sarung,sarut,sasak,sasap,sasar,sasau,nyata,satih,satron,satu meja,saturasi,sauh,sauk,saur,sawah,sawala,sawar,sawat,sawer,sawit,sayang,sayap,sayat,sayembara,sayu,sayung,sayup,sayur,seba,sebab,sebak,sebal,sebar,sebat,sebaur,seberang,sebit,sebrot,sebu,sebuk,sebut,sedak,sedang,sedekah,sedekap,derajat,sederhana,sedih,sedot,seduh,segak,segan,segeh,segel,segmen,segmentasi,sehat,sejarah,sejat,sejuk,seka,sekakmat,sekang,sekap,sekar,sekat,sekolah,sekop,sekresi,sekrup,nyekukruk,sekuler,sekuritas,sela,seladang,selak,selam,selamat,selampai,selampit,selang-seling,selangkup,selap,selaput,selar,selara,laras,selat,selawat,selebrasi,seledet,selekeh,selekoh,seleksi,selembana,selempang,nyeleneh,selenggara,selentik,selenting,selesai,seletuk,seleweng,selia,sidik,seligi,seligit,selimpang,selimpat,selimut,selinap,seling,selingar,selingkit,selingkuh,selingkup,selip,selisik,selisip,selisir,selit,selomot,selong,selongkar,selongsong,selonjor,selonong,selot,selotip,selubung,seluduk,seludup,selukat,selundup,selungkup,seluruh,selusuh,selusup,selusur,semah,semak,semangat,semat,semayam,sembahyang,sembai,sembam,sembap,sembarang,sembat,sembelih,sembilu,sembir,semboyan,sembrono,sembuh,sembul,sembunyi,sembur,semen,seminar,semir,sempadan,sempal,sempang,sempat,sempena,sempil,semprit,semprot,sempurna,semu,semur,semut,senak,senandung,senarai,sendal,sendat,sendeng,sender,sendiri,sengaja,sengal,sengam,sengap,sengar,sengat,sengau,senget,senggak,senggang,senggat,senggau,sengget,senggol,sengguk,senggut,sengih,sengir,sengit,sengkak,sengkang,sengkela,sengkelang,sengkeling,sengkelit,sengker,sengkilit,sengko,sengsara,senguk,seni,seniman,sensor,sensus,senta,sentak,sental,senteng,senter,sentil,sentosa,sentralisasi,sentral,sentuh,senyap,nyenyeh,senyum,sepah,sepak,sepakat,sepan,sepatu,sepel,sepele,seperah,seperti,sepi,sepit,sepuh,sepuk,ragam,seragam,serah,serah terima,serak,seram,serampang,serana,seranah,serandang,serang,seranggung,rangkai,serangsang,serani,seranta,serap,serapah,serasi,serat,ratus,seraya,serbak,serbet,serbu,serbuk,rempak,serempet,serendeng,serengeh,rentak,serep,seret,sergah,sergap,seri,ribu,serikat,serimpet,serimpung,serindai,sering,seringai,seringing,serit,serius,serkah,serkai,serkap,serkup,serlah,sernak,serobot,serok,serondol,serondong,serong,seronok,seropot,serosoh,serot,serpih,sertifikasi,sertifikat,sertu,seru,seruak,serudi,seruduk,seruit,serum,serunda,serundang,rupa,seruput,serut,seruyuk,sesah,sesak,sesal,sesap,sesar,sesat,seser,suai,setek,setel,seteleng,setem,setik,setip,setir,setop,setor,setrap,setrika,setrip,setrum,setu,setum,setup,sewat,siaga,siah,sialang,sial,siap siaga,siar,siat,sibak,sibuk,sibur,sidai,sidang,siduk,sifat,sigai,sigap,sigar,sigi,sigung,sihir,sikat,siksa,siku,sikut,silam,silap,silat,silau,silet,silih,silik,silu,simak,simbah,simbang,simbek,simbur,simetris,simpai,simpan,simpang,simpati,simpir,simpuh,simpuk,simpul,sinar,sinden,sindir,sinetron,singgang,singgir,singgit,singgul,singgung,singit,singkap,singkir,singkur,singsat,singset,singsing,sinis,sinonim,sinopsis,sintas,sinter,sintesis,sintetis,sintuk,sintung,sipat,sipi,sipil,sipit,siput,sira,siram,sirap,sirat,sirep,sirih,sirik,sirip,sirkam,sirkulasi,sirkumsisi,sirna,sisa,sisih,sisik,sisir,sisit,sistem,sistematisasi,sita,sitasi,sitat,sitir,situasi,siuk,siul,sobat,sobek,sodet,sodok,sodomi,sodor,soga,sogok,soja,sokom,sokong,solang,solder,solid,solusi,sombol,sombong,sompoh,sonar,sondang,sondong,songket,songsong,sontok,nyonyong,nyonyor,sopan,sopir,sorak,sorong,sorot,sosis,sosoh,sosok,sosor,soto,soyak,suak,suaka,suap,suar,suara,suarang,suasana,subal,subang,subkontrak,sublim,subordinasi,subsider,subur,subversi,suci hama,sudet,sudip,sudu,sudut,sugar,sugi,suguh,sugun,suji,suka,sukat,suksesi,sula,sulam,sulang,sulap,sulih,sulih suara,suling,suluh,sulur,sulut,sumba,sumbang,sumbar,sumbat,sumbi,sumbu,sumbur,sumir,sumpal,sumpit,sumsum,sunah,sunam,sunat,sunat rasul,sundak,sunda,sundal,sunduk,sundul,sundut,sungga,sunggi,sungging,sunggit,sungkah,sungkal,sungkem,sungkit,sungkum,sungkup,sungkur,sungsang,suntih,suntik,sunu,sunyi,nyunyut,supervisi,supit,suplai,suporter,surai,suram,surat,surih,suruh,suruk,surup,surut,survei,suspensi,susu,susuk,susul,susun,susup,susur,susut,sutra,sutradara,suwir,zakat,zalim,zaman,zarah,ziarah,zikir,zina,makalah,maksiat,maksimum,mangkir,paragraf,maraton,partisi,mastautin,materi,patih,payar,bait,balok,balungan,barap,barong,batu bara,bayun,becak,bedeng,beduk,belandong,beringas,berok,bestral,bikang,bini,birokrasi,bonang,botol,briket,brongsong,buluh,meditasi,medsos,pelangi,pensil,fasilitasi,fungsional,pemidang,pincang,pinggang,mintakat,pipa,pipet,pirsa,plastis,mobil,model,mogok,mohon,polimer,momong,monolog,montok,motivator,prasaran,prasasti,profil,prototipe,mujur,mulsa,pungkur,pustaka,tahir,tajur,talun,tandon,tanggui,nasab,naskah,nasyid,tata guna,tata laksana,tata usaha,cacah jiwa,cahari,cakak,capit,cerudik,cita rasa,contreng,dadah,daur,daur ulang,dayang,definitif,legitimasi,demisioner,demosi,denah,deposisi,deposit,detoks,diagonal,diet,diftong,digit,digitalisasi,dimensi,disko,dokar,doksing,dongkok,donor,dosa,dukuh,negeri,nekat,tembolok,tenggat,neon,aba,abih,acak,acar,afiks,ajur,aksioma,akun,akurat,algoritma,aliansi,alkohol,amalgam,ambil alih,amit,amorf,kanal,kanibal,anjlok,antang,kanti,kapit,kapling,karakter,aram,karbonasi,arip,aroma,aset,atraksi,awaair,awaasam,awabau,awabusa,awalembap,awan,awawarna,efisiensi,hos,eksfoliasi,kelakar,emisi,enkode,plot,pot,es,ketip,gacor,gamang,gandal,gaplek,geber,gede,gelondong,gendang,gering,gerobak,grafiti,gugus,gurun,hapus buku,harit,harkat,hentar,hipnotis,hujung,kicau,ider,ijon,ikan,ilas,inflasi,inisiatif,instalasi,internet,invensi,inventaris,inventori,invois,iri,irik,kitab,itam,khidmat,klaster,klorin,laju,laris,koar,oksida,oksigen,kolektif,ozon,rajin,rawit,kuas,ubah bentuk,ulos,kuras,urun,tikung,jajan,jalur,jamas,jeda,jelah,jemaat,jenama,jengkek,jimat,jinayah,jurnal,nobat,pental,pentol,nuansa,turi,sair,sampel,saup,selera,penyet,sia,sinrili,siter,solok,surya,zona".split(","));
		}
		return rootWordsCache;
	}


    var a_0 = [new Among("kah", -1, 1), new Among("lah", -1, 1),
    new Among("pun", -1, 1)], a_1 = [new Among("nya", -1, 1),
    new Among("ku", -1, 1), new Among("mu", -1, 1)], a_2 = [
        new Among("i", -1, 1, r_SUFFIX_I_OK), new Among("an", -1, 1,
            r_SUFFIX_AN_OK), new Among("kan", 1, 1, r_SUFFIX_KAN_OK)], a_3 = [
                new Among("di", -1, 1), new Among("ke", -1, 2), new Among("me",
                    -1, 1), new Among("mem", 2, 5), new Among("men", 2, 1),
                new Among("meng", 4, 1), new Among("menge", 5, 1, r_CONSONANT_AFTER_E), new Among("meny", 4, 3, r_VOWEL),
                new Among("pem", -1, 6), new Among("pen", -1, 2), new Among(
                    "peng", 9, 2), new Among("penge", 10, 2, r_CONSONANT_AFTER_E), new Among("peny", 9, 4, r_VOWEL), new Among(
                         "ter", -1, 1)], a_4 = [new Among("be", -1, 3, r_KER),
                         new Among("belajar", 0, 4), new Among("ber", 0, 3), new Among(
                             "pe", -1, 1), new Among("pelajar", 3, 2), new Among("per", 3, 1), new Among("se", -1, 1)], g_vowel = [17, 65, 16], I_prefix, I_measure, matched_prefix, exception_words = ["terampil"], saved_word, sbp = new SnowballProgram();
    this.setCurrent = function (word) {
        saved_word = word;
        sbp.setCurrent(word);
    };
    this.getCurrent = function () {
        return sbp.getCurrent();
    };
    function r_remove_particle() {
        sbp.ket = sbp.cursor;
        if (sbp.find_among_b(a_0, 3) === 0) {
            return false;
        }
        if (I_measure - 1 <= 2) {
            var particleStart = sbp.cursor;
            var rest = saved_word.substring(sbp.limit_backward, particleStart);
            if (rest.indexOf("meng") === 0 || rest.indexOf("menge") === 0 ||
                rest.indexOf("meny") === 0 || rest.indexOf("men") === 0 ||
                rest.indexOf("mem") === 0 || rest.indexOf("me") === 0 ||
                rest.indexOf("peng") === 0 || rest.indexOf("penge") === 0 ||
                rest.indexOf("peny") === 0 || rest.indexOf("pen") === 0 ||
                rest.indexOf("pem") === 0 || rest.indexOf("pe") === 0 ||
                rest.indexOf("ter") === 0 || rest.indexOf("di") === 0 ||
                rest.indexOf("ke") === 0 || rest.indexOf("ber") === 0 ||
                rest.indexOf("per") === 0) {
                return false;
            }
        }
        sbp.bra = sbp.cursor;
        sbp.slice_del();
        I_measure -= 1;
        return true;
    }

    function r_remove_possessive_pronoun() {
        sbp.ket = sbp.cursor;
        if (sbp.find_among_b(a_1, 3) === 0) {
            return false;
        }
        sbp.bra = sbp.cursor;
        sbp.slice_del();
        I_measure -= 1;
        return true;
    }

    function r_SUFFIX_KAN_OK() {
        if (!(I_prefix !== 3)) {
            return false;
        }
        if (!(I_prefix !== 2)) {
            return false;
        }
        return true;
    }

    function r_SUFFIX_AN_OK() {
        if (!(I_prefix !== 1)) {
            return false;
        }
        return true;
    }

    function r_SUFFIX_I_OK() {
        if (!(I_prefix <= 2)) {
            return false;
        }
        {
            var v_1 = sbp.limit - sbp.cursor;
            lab0: {
                if (!(sbp.eq_s_b(1, "s"))) {
                    break lab0;
                }
                return false;
            }
            sbp.cursor = sbp.limit - v_1;
        }
        if (sbp.cursor > 0) {
            var saved_bra = sbp.bra;
            var saved_ket = sbp.ket;
            sbp.bra = 0;
            sbp.ket = sbp.cursor;
            var stem = sbp.slice_to();
            sbp.bra = saved_bra;
            sbp.ket = saved_ket;
            if (!getRootWords().has(stem)) {
                return false;
            }
        }
        return true;
    }

    function r_remove_suffix() {
        sbp.ket = sbp.cursor;
        if (sbp.find_among_b(a_2, 3) === 0) {
            return false;
        }
        sbp.bra = sbp.cursor;
        sbp.slice_del();
        I_measure -= 1;
        return true;
    }

    function r_VOWEL() {
        if (!(sbp.in_grouping(g_vowel, 97, 117))) {
            return false;
        }
        return true;
    }

    function r_CONSONANT_AFTER_E() {
        var c = sbp.cursor;
        sbp.cursor = c;
        var result = sbp.out_grouping(g_vowel, 97, 117);
        sbp.cursor = c;
        return result;
    }

    function r_KER() {
        if (!(sbp.out_grouping(g_vowel, 97, 117))) {
            return false;
        }
        if (!(sbp.eq_s(2, "er"))) {
            return false;
        }
        return true;
    }

    function r_detect_matched_prefix() {
        var c = sbp.cursor;
        if (sbp.eq_s_b(5, "menge")) return "menge";
        if (sbp.eq_s_b(5, "penge")) return "penge";
        if (sbp.eq_s_b(4, "meng")) return "meng";
        if (sbp.eq_s_b(3, "men")) return "men";
        if (sbp.eq_s_b(3, "mem")) return "mem";
        if (sbp.eq_s_b(3, "ter")) return "ter";
        if (sbp.eq_s_b(4, "peng")) return "peng";
        if (sbp.eq_s_b(3, "pen")) return "pen";
        if (sbp.eq_s_b(3, "pem")) return "pem";
        if (sbp.eq_s_b(2, "me")) return "me";
        if (sbp.eq_s_b(2, "di")) return "di";
        if (sbp.eq_s_b(2, "ke")) return "ke";
        sbp.cursor = c;
        return null;
    }

    function r_restore_consonant() {
        if (!matched_prefix) return;
        var isNasal = (matched_prefix === "mem" || matched_prefix === "men" ||
                       matched_prefix === "meng" || matched_prefix === "pem" ||
                       matched_prefix === "pen" || matched_prefix === "peng" ||
                       matched_prefix === "menge" || matched_prefix === "penge");
        if (!isNasal) return;
        var c = sbp.cursor;
        var isMenge = (matched_prefix === "menge" || matched_prefix === "penge");
        if (!isMenge) {
            if (!sbp.in_grouping(g_vowel, 97, 117)) {
                sbp.cursor = c;
                return;
            }
            sbp.cursor = c;
        }
        var alternatives;
        switch (matched_prefix) {
            case "mem": case "pem": alternatives = ["m","p"]; break;
            case "men": case "pen": alternatives = ["t","n"]; break;
            case "meng": case "peng": case "menge": case "penge": alternatives = ["k"]; break;
            default: return;
        }
        var saved_bra = sbp.bra;
        var saved_ket = sbp.ket;
        sbp.bra = c;
        sbp.ket = sbp.limit;
        var remainder = sbp.slice_to();
        sbp.bra = saved_bra;
        sbp.ket = saved_ket;
        var stemCandidates = [remainder];
        if (remainder.endsWith("kan")) stemCandidates.push(remainder.slice(0, -3));
        if (remainder.endsWith("an")) stemCandidates.push(remainder.slice(0, -2));
        if (remainder.endsWith("i")) stemCandidates.push(remainder.slice(0, -1));
        var rootSet = getRootWords();
        var checkStemAlone = (matched_prefix === "meng" || matched_prefix === "peng");
        if (isMenge) {
            for (var ci = 0; ci < stemCandidates.length; ci++) {
                if (rootSet.has(stemCandidates[ci])) return;
            }
            checkStemAlone = false;
        }
        for (var ci = 0; ci < stemCandidates.length; ci++) {
            var stem = stemCandidates[ci];
            if (checkStemAlone && rootSet.has(stem)) return;
            if (isMenge) {
                var eStem = "e" + stem;
                if (rootSet.has(eStem)) {
                    sbp.insert(c, c, "e");
                    return;
                }
            }
            for (var ai = 0; ai < alternatives.length; ai++) {
                var insertion = alternatives[ai];
                if (isMenge) insertion = alternatives[ai] + "e";
                var alt = insertion + stem;
                if (rootSet.has(alt)) {
                    sbp.insert(c, c, insertion);
                    return;
                }
            }
        }
    }

    function r_remove_first_order_prefix() {
        var among_var;
        sbp.bra = sbp.cursor;
        among_var = sbp.find_among(a_3, 14);
        if (among_var === 0) {
            return false;
        }
        sbp.ket = sbp.cursor;
        switch (among_var) {
            case 1:
                matched_prefix = r_detect_matched_prefix();
                sbp.slice_del();
                I_prefix = 1;
                I_measure -= 1;
                break;
            case 2:
                matched_prefix = r_detect_matched_prefix();
                sbp.slice_del();
                I_prefix = 3;
                I_measure -= 1;
                break;
            case 3:
                matched_prefix = "me";
                I_prefix = 1;
                sbp.slice_from("s");
                I_measure -= 1;
                break;
            case 4:
                matched_prefix = "peny";
                I_prefix = 3;
                sbp.slice_from("s");
                I_measure -= 1;
                break;
            case 5:
                matched_prefix = "mem";
                I_prefix = 1;
                I_measure -= 1;
                sbp.slice_del();
                break;
            case 6:
                matched_prefix = "pem";
                I_prefix = 3;
                I_measure -= 1;
                sbp.slice_del();
                break;
        }
        return true;
    }

    function r_remove_second_order_prefix() {
        var among_var;
        sbp.bra = sbp.cursor;
        among_var = sbp.find_among(a_4, 7);
        if (among_var === 0) {
            return false;
        }
        sbp.ket = sbp.cursor;
        switch (among_var) {
            case 1:
                sbp.slice_del();
                I_prefix = 2;
                I_measure -= 1;
                break;
            case 2:
                sbp.slice_from("ajar");
                I_measure -= 1;
                break;
            case 3:
                sbp.slice_del();
                I_prefix = 4;
                I_measure -= 1;
                break;
            case 4:
                sbp.slice_from("ajar");
                I_prefix = 4;
                I_measure -= 1;
                break;
        }
        return true;
    }

    this.stem = function () {
        I_measure = 0;
        for (var i = 0; i < exception_words.length; i++) {
            if (saved_word === exception_words[i]) return false;
        }
        var v_1 = sbp.cursor;
        /* eslint-disable-next-line no-unused-labels */
        lab0: {
            while (true) {
                var v_2 = sbp.cursor;
                lab1: {
                    golab2: while (true) {
                        lab3: {
                            if (!(sbp.in_grouping(g_vowel, 97, 117))) {
                                break lab3;
                            }
                            break golab2;
                        }
                        if (sbp.cursor >= sbp.limit) {
                            break lab1;
                        }
                        sbp.cursor++;
                    }
                    I_measure += 1;
                    continue;
                }
                sbp.cursor = v_2;
                break;
            }
        }
        sbp.cursor = v_1;
        if (!(I_measure > 2)) {
            return false;
        }
        I_prefix = 0;
        sbp.limit_backward = sbp.cursor;
        sbp.cursor = sbp.limit;
        var v_4 = sbp.limit - sbp.cursor;
        r_remove_particle();
        sbp.cursor = sbp.limit - v_4;
        if (!(I_measure > 2)) {
            return false;
        }
        var v_5 = sbp.limit - sbp.cursor;
        r_remove_possessive_pronoun();
        sbp.cursor = sbp.limit - v_5;
        sbp.cursor = sbp.limit_backward;
        if (!(I_measure > 2)) {
            return false;
        }
        lab4: {
            var v_6 = sbp.cursor;
            lab5: {
                var v_7 = sbp.cursor;
                if (!r_remove_first_order_prefix()) {
                    break lab5;
                }
                r_restore_consonant();
                var v_8 = sbp.cursor;
                lab6: {
                    var v_9 = sbp.cursor;
                    if (!(I_measure > 2)) {
                        break lab6;
                    }
                    sbp.limit_backward = sbp.cursor;
                    sbp.cursor = sbp.limit;
                    if (!r_remove_suffix()) {
                        break lab6;
                    }
                    sbp.cursor = sbp.limit_backward;
                    sbp.cursor = v_9;
                    if (!(I_measure > 2)) {
                        break lab6;
                    }
                    if (!r_remove_second_order_prefix()) {
                        break lab6;
                    }
                }
                sbp.cursor = v_8;
                sbp.cursor = v_7;
                break lab4;
            }
            sbp.cursor = v_6;
            var v_10 = sbp.cursor;
            r_remove_second_order_prefix();
            sbp.cursor = v_10;
            var v_11 = sbp.cursor;
            lab7: {
                if (!(I_measure > 2)) {
                    break lab7;
                }
                sbp.limit_backward = sbp.cursor;
                sbp.cursor = sbp.limit;
                if (!r_remove_suffix()) {
                    break lab7;
                }
                sbp.cursor = sbp.limit_backward;
            }
            sbp.cursor = v_11;
        }
        return true;
    };
}
