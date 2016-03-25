
/*
    NOTE: Idea for a better algorithm!!

    using these word lists and a couple large, digital books I should
    write a program that analyses the books and "ranks" word pairs based on
    how often they appear 1-2 words from each other.

    example

    if "Old" is found next to "man" often, "old" would have a high pair rank
    if "young" is found next to "man" often but not as often as "old" if would be given a weaker rank
    
    Adj pairings for "man"
    1. old 
    2. young 
    etc....


*/
var canvas = document.getElementById('myCanvas');
var canvasContext = canvas.getContext('2d');
var gui = new GUIComponent();
var mouseX = 0;
var mouseY = 0;
var mouseClicked = false;

var literalFlag = true;
var pluralFlagOne = false;
var pluralFlahTwo = false;

var adjList;
var nounList; 
var verbList;

//2d array
// Plural, non plural
var articleList;

//maybe
var adverbs;


//gui elements
var generateButton;
var isMetaphorCheckbox;

var colour;
var upColour;
var downColour;

var lyricTopicLineOne = "Click Generate!";
var lyricTopicLineTwo = "";
var lyricTopicLineThree = "";

canvas.addEventListener('mousemove',function(event)
{
   
    mouseX = calculateMousePosition(event).x;
    mouseY = calculateMousePosition(event).y;
    gui.update(mouseX,mouseY,mouseClicked);
    draw();

    
});
function calculateMousePosition(evt)
{

    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mousePosX = evt.clientX- rect.left - root.scrollLeft;
    var mousePosY = evt.clientY- rect.top - root.scrollLeft;
    
    
    return {
        x:mousePosX,
        y:mousePosY
    }
}
canvas.addEventListener('mousedown',function(event)
{
    mouseClicked = true;
    gui.update(mouseX,mouseY,mouseClicked);
    draw();
   

},false);

canvas.addEventListener('mouseup',function(event)
{
    mouseClicked = false;
    gui.update(mouseX,mouseY,mouseClicked);
    draw();

},false);

init();
function init()
{
    colour = new colourObj();
    upColour = new colourObj();
    downColour = new colourObj();

    colour.red = 255;
    colour.blue = 255;
    colour.green = 255;

    upColour.red = 0;
    upColour.green = 153;
    upColour.blue = 255;

    downColour.red = 0;
    downColour.green = 122;
    downColour.blue = 204;

    //all adjectives 
    adjList = ["abandoned","able","absolute","adorable","adventurous","academic","acceptable","acclaimed","accomplished","accurate","aching","acidic","acrobatic","active","actual","adept","admirable","admired","adolescent","adorable","adored","advanced","afraid","affectionate","aged","aggravating","aggressive","agile","agitated","agonizing","agreeable","ajar","alarmed","alarming","alert","alienated","alive","all","altruistic","amazing","ambitious","ample","amused","amusing","anchored","ancient","angelic","angry","anguished","animated","annual","another","antique","anxious","any","apprehensive","appropriate","apt","arctic","arid","aromatic","artistic","ashamed","assured","astonishing","athletic","attached","attentive","attractive","austere","authentic","authorized","automatic","avaricious","average","aware","awesome","awful","awkward","babyish","bad","back","baggy","bare","barren","basic","beautiful","belated","beloved","beneficial","better","best","bewitched","big","big-hearted","biodegradable","bite-sized","bitter","black","black-and-white","bland","blank","blaring","bleak","blind","blissful","blond","blue","blushing","bogus","boiling","bold","bony","boring","bossy","both","bouncy","bountiful","bowed","brave","breakable","brief","bright","brilliant","brisk","broken","bronze","brown","bruised","bubbly","bulky","bumpy","buoyant","burdensome","burly","bustling","busy","buttery","buzzing","calculating","calm","candid","canine","capital","carefree","careful","careless","caring","cautious","cavernous","celebrated","charming","cheap","cheerful","cheery","chief","chilly","chubby","circular","classic","clean","clear","clear-cut","clever","close","closed","cloudy","clueless","clumsy","cluttered","coarse","cold","colorful","colorless","colossal","comfortable","common","compassionate","competent","complete","complex","complicated","composed","concerned","concrete","confused","conscious","considerate","constant","content","conventional","cooked","cool","cooperative","coordinated","corny","corrupt","costly","courageous","courteous","crafty","crazy","creamy","creative","creepy","criminal","crisp","critical","crooked","crowded","cruel","crushing","cuddly","cultivated","cultured","cumbersome","curly","curvy","cute","cylindrical","damaged","damp","dangerous","dapper","daring","darling","dark","dazzling","dead","deadly","deafening","dear","dearest","decent","decimal","decisive","deep","defenseless","defensive","defiant","deficient","definite","definitive","delayed","delectable","delicious","delightful","delirious","demanding","dense","dental","dependable","dependent","descriptive","deserted","detailed","determined","devoted","different","difficult","digital","diligent","dim","dimpled","dimwitted","direct","disastrous","discrete","disfigured","disgusting","disloyal","dismal","distant","downright","dreary","dirty","disguised","dishonest","dismal","distant","distinct","distorted","dizzy","dopey","doting","double","downright","drab","drafty","dramatic","dreary","droopy","dry","dual","dull","dutiful","each","eager","earnest","early","easy","easy-going","ecstatic","edible","educated","elaborate","elastic","elated","elderly","electric","elegant","elementary","elliptical","embarrassed","embellished","eminent","emotional","empty","enchanted","enchanting","energetic","enlightened","enormous","enraged","entire","envious","equal","equatorial","essential","esteemed","ethical","euphoric","even","evergreen","everlasting","every","evil","exalted","excellent","exemplary","exhausted","excitable","excited","exciting","exotic","expensive","experienced","expert","extraneous","extroverted","extra-large","extra-small","fabulous","failing","faint","fair","faithful","fake","false","familiar","famous","fancy","fantastic","far","faraway","far-flung","far-off","fast","fat","fatal","fatherly","favorable","favorite","fearful","fearless","feisty","feline","female","feminine","few","fickle","filthy","fine","finished","firm","first","firsthand","fitting","fixed","flaky","flamboyant","flashy","flat","flawed","flawless","flickering","flimsy","flippant","flowery","fluffy","fluid","flustered","focused","fond","foolhardy","foolish","forceful","forked","formal","forsaken","forthright","fortunate","fragrant","frail","frank","frayed","free","French","fresh","frequent","friendly","frightened","frightening","frigid","frilly","frizzy","frivolous","front","frosty","frozen","frugal","fruitful","full","fumbling","functional","funny","fussy","fuzzy","gargantuan","gaseous","general","generous","gentle","genuine","giant","giddy","gigantic","gifted","giving","glamorous","glaring","glass","gleaming","gleeful","glistening","glittering","gloomy","glorious","glossy","glum","golden","good","good-natured","gorgeous","graceful","gracious","grand","grandiose","granular","grateful","grave","gray","great","greedy","green","gregarious","grim","grimy","gripping","grizzled","gross","grotesque","grouchy","grounded","growing","growling","grown","grubby","gruesome","grumpy","guilty","gullible","gummy","hairy","half","handmade","handsome","handy","happy","happy-go-lucky","hard","hard-to-find","harmful","harmless","harmonious","harsh","hasty","hateful","haunting","healthy","heartfelt","hearty","heavenly","heavy","hefty","helpful","helpless","hidden","hideous","high","high-level","hilarious","hoarse","hollow","homely","honest","honorable","honored","hopeful","horrible","hospitable","hot","huge","humble","humiliating","humming","humongous","hungry","hurtful","husky","icky","icy","ideal","idealistic","identical","idle","idiotic","idolized","ignorant","ill","illegal","ill-fated","ill-informed","illiterate","illustrious","imaginary","imaginative","immaculate","immaterial","immediate","immense","impassioned","impeccable","impartial","imperfect","imperturbable","impish","impolite","important","impossible","impractical","impressionable","impressive","improbable","impure","inborn","incomparable","incompatible","incomplete","inconsequential","incredible","indelible","inexperienced","indolent","infamous","infantile","infatuated","inferior","infinite","informal","innocent","insecure","insidious","insignificant","insistent","instructive","insubstantial","intelligent","intent","intentional","interesting","internal","international","intrepid","ironclad","irresponsible","irritating","itchy","jaded","jagged","jam-packed","jaunty","jealous","jittery","joint","jolly","jovial","joyful","joyous","jubilant","judicious","juicy","jumbo","junior","jumpy","juvenile","kaleidoscopic","keen","key","kind","kindhearted","kindly","klutzy","knobby","knotty","knowledgeable","knowing","known","kooky","kosher","lame","lanky","large","last","lasting","late","lavish","lawful","lazy","leading","lean","leafy","left","legal","legitimate","light","lighthearted","likable","likely","limited","limp","limping","linear","lined","liquid","little","live","lively","livid","loathsome","lone","lonely","long","long-term","loose","lopsided","lost","loud","lovable","lovely","loving","low","loyal","lucky","lumbering","luminous","lumpy","lustrous","luxurious","mad","made-up","magnificent","majestic","major","male","mammoth","married","marvelous","masculine","massive","mature","meager","mealy","mean","measly","meaty","medical","mediocre","medium","meek","mellow","melodic","memorable","menacing","merry","messy","metallic","mild","milky","mindless","miniature","minor","minty","miserable","miserly","misguided","misty","mixed","modern","modest","moist","monstrous","monthly","monumental","moral","mortified","motherly","motionless","mountainous","muddy","muffled","multicolored","mundane","murky","mushy","musty","muted","mysterious","naive","narrow","nasty","natural","naughty","nautical","near","neat","necessary","needy","negative","neglected","negligible","neighboring","nervous","new","next","nice","nifty","nimble","nippy","nocturnal","noisy","nonstop","normal","notable","noted","noteworthy","novel","noxious","numb","nutritious","nutty","obedient","obese","oblong","oily","oblong","obvious","occasional","odd","oddball","offbeat","offensive","official","old","old-fashioned","only","open","optimal","optimistic","opulent","orange","orderly","organic","ornate","ornery","ordinary","original","other","our","outlying","outgoing","outlandish","outrageous","outstanding","oval","overcooked","overdue","overjoyed","overlooked","palatable","pale","paltry","parallel","parched","partial","passionate","past","pastel","peaceful","peppery","perfect","perfumed","periodic","perky","personal","pertinent","pesky","pessimistic","petty","phony","physical","piercing","pink","pitiful","plain","plaintive","plastic","playful","pleasant","pleased","pleasing","plump","plush","polished","polite","political","pointed","pointless","poised","poor","popular","portly","posh","positive","possible","potable","powerful","powerless","practical","precious","present","prestigious","pretty","precious","previous","pricey","prickly","primary","prime","pristine","private","prize","probable","productive","profitable","profuse","proper","proud","prudent","punctual","pungent","puny","pure","purple","pushy","putrid","puzzled","puzzling","quaint","qualified","quarrelsome","quarterly","queasy","querulous","questionable","quick","quick-witted","quiet","quintessential","quirky","quixotic","quizzical","radiant","ragged","rapid","rare","rash","raw","recent","reckless","rectangular","ready","real","realistic","reasonable","red","reflecting","regal","regular","reliable","relieved","remarkable","remorseful","remote","repentant","required","respectful","responsible","repulsive","revolving","rewarding","rich","rigid","right","ringed","ripe","roasted","robust","rosy","rotating","rotten","rough","round","rowdy","royal","rubbery","rundown","ruddy","rude","runny","rural","rusty","sad","safe","salty","same","sandy","sane","sarcastic","sardonic","satisfied","scaly","scarce","scared","scary","scented","scholarly","scientific","scornful","scratchy","scrawny","second","secondary","second-hand","secret","self-assured","self-reliant","selfish","sentimental","separate","serene","serious","serpentine","several","severe","shabby","shadowy","shady","shallow","shameful","shameless","sharp","shimmering","shiny","shocked","shocking","shoddy","short","short-term","showy","shrill","shy","sick","silent","silky","silly","silver","similar","simple","simplistic","sinful","single","sizzling","skeletal","skinny","sleepy","slight","slim","slimy","slippery","slow","slushy","small","smart","smoggy","smooth","smug","snappy","snarling","sneaky","sniveling","snoopy","sociable","soft","soggy","solid","somber","spherical","sophisticated","sore","sorrowful","soulful","soupy","sour","Spanish","sparkling","sparse","specific","spectacular","speedy","spicy","spiffy","spirited","spiteful","splendid","spotless","spotted","spry","square","squeaky","squiggly","stable","staid","stained","stale","standard","starchy","stark","starry","steep","sticky","stiff","stimulating","stingy","stormy","straight","strange","steel","strict","strident","striking","striped","strong","studious","stunning","stupendous","stupid","sturdy","stylish","subdued","submissive","substantial","subtle","suburban","sudden","sugary","sunny","super","superb","superficial","superior","supportive","sure-footed","surprised","suspicious","svelte","sweaty","sweet","sweltering","swift","sympathetic","tall","talkative","tame","tan","tangible","tart","tasty","tattered","taut","tedious","teeming","tempting","tender","tense","tepid","terrible","terrific","testy","thankful","that","these","thick","thin","third","thirsty","this","thorough","thorny","those","thoughtful","threadbare","thrifty","thunderous","tidy","tight","timely","tinted","tiny","tired","torn","total","tough","traumatic","treasured","tremendous","tragic","trained","tremendous","triangular","tricky","trifling","trim","trivial","troubled","true","trusting","trustworthy","trusty","truthful","tubby","turbulent","twin","ugly","ultimate","unacceptable","unaware","uncomfortable","uncommon","unconscious","understated","unequaled","uneven","unfinished","unfit","unfolded","unfortunate","unhappy","unhealthy","uniform","unimportant","unique","united","unkempt","unknown","unlawful","unlined","unlucky","unnatural","unpleasant","unrealistic","unripe","unruly","unselfish","unsightly","unsteady","unsung","untidy","untimely","untried","untrue","unused","unusual","unwelcome","unwieldy","unwilling","unwitting","unwritten","upbeat","upright","upset","urban","usable","used","useful","useless","utilized","utter","vacant","vague","vain","valid","valuable","vapid","variable","vast","velvety","venerated","vengeful","verifiable","vibrant","vicious","victorious","vigilant","vigorous","villainous","violet","violent","virtual","virtuous","visible","vital","vivacious","vivid","voluminous","wan","warlike","warm","warmhearted","warped","wary","wasteful","watchful","waterlogged","watery","wavy","wealthy","weak","weary","webbed","wee","weekly","weepy","weighty","weird","welcome","well-documented","well-groomed","well-informed","well-lit","well-made","well-off","well-to-do","well-worn","wet","which","whimsical","whirlwind","whispered","white","whole","whopping","wicked","wide","wide-eyed","wiggly","wild","willing","wilted","winding","windy","winged","wiry","wise","witty","wobbly","woeful","wonderful","wooden","woozy","wordy","worldly","worn","worried","worrisome","worse","worst","worthless","worthwhile","worthy","wrathful","wretched","writhing","wrong","wry","yawning","yearly","yellow","yellowish","young","youthful","yummy","zany","zealous","zesty","zigzag"];

    //all nouns
    nounList = ["account","achiever","acoustics","act","action","activity","actor","addition","adjustment","advertisement","advice","aftermath","afternoon","afterthought","agreement","air","airplane","airport","alarm","amount","amusement","anger","angle","animal","answer","ant","ants","apparatus","apparel","apple","apples","appliance","approval","arch","argument","arithmetic","arm","army","art","attack","attempt","attention","attraction","aunt","authority","babies","baby","back","badge","bag","bait","balance","ball","balloon","balls","banana","band","base","baseball","basin","basket","basketball","bat","bath","battle","bead","beam","bean","bear","bears","beast","bed","bedroom","beds","bee","beef","beetle","beggar","beginner","behavior","belief","believe","bell","bells","berry","bike","bikes","bird","birds","birth","birthday","bit","bite","blade","blood","blow","board","boat","boats","body","bomb","bone","book","books","boot","border","bottle","boundary","box","boy","boys","brain","brake","branch","brass","bread","breakfast","breath","brick","bridge","brother","brothers","brush","bubble","bucket","building","bulb","bun","burn","burst","bushes","business","butter","button","cabbage","cable","cactus","cake","cakes","calculator","calendar","camera","camp","can","cannon","canvas","cap","caption","car","card","care","carpenter","carriage","cars","cart","cast","cat","cats","cattle","cause","cave","celery","cellar","cemetery","cent","chain","chair","chairs","chalk","chance","change","channel","cheese","cherries","cherry","chess","chicken","chickens","children","chin","church","circle","clam","class","clock","clocks","cloth","cloud","clouds","clover","club","coach","coal","coast","coat","cobweb","coil","collar","color","comb","comfort","committee","company","comparison","competition","condition","connection","control","cook","copper","copy","cord","cork","corn","cough","country","cover","cow","cows","crack","cracker","crate","crayon","cream","creator","creature","credit","crib","crime","crook","crow","crowd","crown","crush","cry","cub","cup","current","curtain","curve","cushion","dad","daughter","day","death","debt","decision","deer","degree","design","desire","desk","destruction","detail","development","digestion","dime","dinner","dinosaurs","direction","dirt","discovery","discussion","disease","disgust","distance","distribution","division","dock","doctor","dog","dogs","doll","dolls","donkey","door","downtown","drain","drawer","dress","drink","driving","drop","drug","drum","duck","ducks","dust","ear","earth","earthquake","edge","education","effect","egg","eggnog","eggs","elbow","end","engine","error","event","example","exchange","existence","expansion","experience","expert","eye","eyes","face","fact","fairies","fall","family","fan","fang","farm","farmer","father","father","faucet","fear","feast","feather","feeling","feet","fiction","field","fifth","fight","finger","finger","fire","fireman","fish","flag","flame","flavor","flesh","flight","flock","floor","flower","flowers","fly","fog","fold","food","foot","force","fork","form","fowl","frame","friction","friend","friends","frog","frogs","front","fruit","fuel","furniture","alley","game","garden","gate","geese","ghost","giants","giraffe","girl","girls","glass","glove","glue","goat","gold","goldfish","good-bye","goose","government","governor","grade","grain","grandfather","grandmother","grape","grass","grip","ground","group","growth","guide","guitar","gun","hair","haircut","hall","hammer","hand","hands","harbor","harmony","hat","hate","head","health","hearing","heart","heat","help","hen","hill","history","hobbies","hole","holiday","home","honey","hook","hope","horn","horse","horses","hose","hospital","hot","hour","house","houses","humor","hydrant","ice","icicle","idea","impulse","income","increase","industry","ink","insect","instrument","insurance","interest","invention","iron","island","jail","jam","jar","jeans","jelly","jellyfish","jewel","join","joke","journey","judge","juice","jump","kettle","key","kick","kiss","kite","kitten","kittens","kitty","knee","knife","knot","knowledge","laborer","lace","ladybug","lake","lamp","land","language","laugh","lawyer","lead","leaf","learning","leather","leg","legs","letter","letters","lettuce","level","library","lift","light","limit","line","linen","lip","liquid","list","lizards","loaf","lock","locket","look","loss","love","low","lumber","lunch","lunchroom","machine","magic","maid","mailbox","man","manager","map","marble","mark","market","mask","mass","match","meal","measure","meat","meeting","memory","men","metal","mice","middle","milk","mind","mine","minister","mint","minute","mist","mitten","mom","money","monkey","month","moon","morning","mother","motion","mountain","mouth","move","muscle","music","nail","name","nation","neck","need","needle","nerve","nest","net","news","night","noise","north","nose","note","notebook","number","nut","oatmeal","observation","ocean","offer","office","oil","operation","opinion","orange","oranges","order","organization","ornament","oven","owl","owner","page","pail","pain","paint","pan","pancake","paper","parcel","parent","park","part","partner","party","passenger","paste","patch","payment","peace","pear","pen","pencil","person","pest","pet","pets","pickle","picture","pie","pies","pig","pigs","pin","pipe","pizzas","place","plane","planes","plant","plantation","plants","plastic","plate","play","playground","pleasure","plot","plough","pocket","point","poison","police","polish","pollution","popcorn","porter","position","pot","potato","powder","power","price","print","prison","process","produce","profit","property","prose","protest","pull","pump","punishment","purpose","push","quarter","quartz","queen","question","quicksand","quiet","quill","quilt","quince","quiver","rabbit","rabbits","rail","railway","rain","rainstorm","rake","range","rat","rate","ray","reaction","reading","reason","receipt","recess","record","regret","relation","religion","representative","request","respect","rest","reward","rhythm","rice","riddle","rifle","ring","rings","river","road","robin","rock","rod","roll","roof","room","root","rose","route","rub","rule","run","sack","sail","salt","sand","scale","scarecrow","scarf","scene","scent","school","science","scissors","screw","sea","seashore","seat","secretary","seed","selection","self","sense","servant","shade","shake","shame","shape","sheep","sheet","shelf","ship","shirt","shock","shoe","shoes","shop","show","side","sidewalk","sign","silk","silver","sink","sister","sisters","size","skate","skin","skirt","sky","slave","sleep","sleet","slip","slope","smash","smell","smile","smoke","snail","snails","snake","snakes","sneeze","snow","soap","society","sock","soda","sofa","son","song","songs","sort","sound","soup","space","spade","spark","spiders","sponge","spoon","spot","spring","spy","square","squirrel","stage","stamp","star","start","statement","station","steam","steel","stem","step","stew","stick","sticks","stitch","stocking","stomach","stone","stop","store","story","stove","stranger","straw","stream","street","stretch","string","structure","substance","sugar","suggestion","suit","summer","sun","support","surprise","sweater","swim","swing","system","table","tail","talk","tank","taste","tax","teaching","team","teeth","temper","tendency","tent","territory","test","texture","theory","thing","things","thought","thread","thrill","throat","throne","thumb","thunder","ticket","tiger","time","tin","title","toad","toe","toes","tomatoes","tongue","tooth","toothbrush","toothpaste","top","touch","town","toy","toys","trade","trail","train","trains","tramp","transport","tray","treatment","tree","trees","trick","trip","trouble","trousers","truck","trucks","tub","turkey","turn","twig","twist","umbrella","uncle","underwear","unit","use","vacation","value","van","vase","vegetable","veil","vein","verse","vessel","vest","view","visitor","voice","volcano","volleyball","voyage","walk","wall","war","wash","waste","watch","water","wave","waves","wax","way","wealth","weather","week","weight","wheel","whip","whistle","wilderness","wind","window","wine","wing","winter","wire","wish","woman","women","wood","wool","word","work","worm","wound","wren","wrench","wrist","writer","writing","yak","yam","yard","yarn","year","yoke","zebra","zephyr","zinc","zipper"];
    //all verbs
    verbList = ["abide","accelerate","accept","accomplish","achieve","acquire","acted","activate","adapt","add","address","administer","admire","admit","adopt","advise","afford","agree","alert","alight","allow","altered","amuse","analyze","announce","annoy","answer","anticipate","apologize","appear","applaud","applied","appoint","appraise","appreciate","approve","arbitrate","argue","arise","arrange","arrest","arrive","ascertain","ask","assemble","assess","assist","assure","attach","attack","attain","attempt","attend","attract","audited","avoid","awake","back","bake","balance","ban","bang","bare","bat","bathe","battle","be","beam","bear","beat","become","beg","begin","behave","behold","belong","bend","beset","bet","bid","bind","bite","bleach","bleed","bless","blind","blink","blot","blow","blush","boast","boil","bolt","bomb","book","bore","borrow","bounce","bow","box","brake","branch","break","breathe","breed","brief","bring","broadcast","bruise","brush","bubble","budget","build","bump","burn","burst","bury","bust","buy","buzz","calculate","call","camp","care","carry","carve","cast","catalog","catch","cause","challenge","change","charge","chart","chase","cheat","check","cheer","chew","choke","choose","chop","claim","clap","clarify","classify","clean","clear","cling","clip","close","clothe","coach","coil","collect","color","comb","come","command","communicate","compare","compete","compile","complain","complete","compose","compute","conceive","concentrate","conceptualize","concern","conclude","conduct","confess","confront","confuse","connect","conserve","consider","consist","consolidate","construct","consult","contain","continue","contract","control","convert","coordinate","copy","correct","correlate","cost","cough","counsel","count","cover","crack","crash","crawl","create","creep","critique","cross","crush","cry","cure","curl","curve","cut","cycle","dam","damage","dance","dare","deal","decay","deceive","decide","decorate","define","delay","delegate","delight","deliver","demonstrate","depend","describe","desert","deserve","design","destroy","detail","detect","determine","develop","devise","diagnose","dig","direct","disagree","disappear","disapprove","disarm","discover","dislike","dispense","display","disprove","dissect","distribute","dive","divert","divide","do","double","doubt","draft","drag","drain","dramatize","draw","dream","dress","drink","drip","drive","drop","drown","drum","dry","dust","dwell","earn","eat","edited","educate","eliminate","embarrass","employ","empty","enacted","encourage","end","endure","enforce","engineer","enhance","enjoy","enlist","ensure","enter","entertain","escape","establish","estimate","evaluate","examine","exceed","excite","excuse","execute","exercise","exhibit","exist","expand","expect","expedite","experiment","explain","explode","express","extend","extract","face","facilitate","fade","fail","fancy","fasten","fax","fear","feed","feel","fence","fetch","fight","file","fill","film","finalize","finance","find","fire","fit","fix","flap","flash","flee","fling","float","flood","flow","flower","fly","fold","follow","fool","forbid","force","forecast","forego","foresee","foretell","forget","forgive","form","formulate","forsake","frame","freeze","frighten","fry","gather","gaze","generate","get","give","glow","glue","go","govern","grab","graduate","grate","grease","greet","grin","grind","grip","groan","grow","guarantee","guard","guess","guide","hammer","hand","handle","handwrite","hang","happen","harass","harm","hate","haunt","head","heal","heap","hear","heat","help","hide","hit","hold","hook","hop","hope","hover","hug","hum","hunt","hurry","hurt","hypothesize","identify","ignore","illustrate","imagine","implement","impress","improve","improvise","include","increase","induce","influence","inform","initiate","inject","injure","inlay","innovate","input","inspect","inspire","install","institute","instruct","insure","integrate","intend","intensify","interest","interfere","interlay","interpret","interrupt","interview","introduce","invent","inventory","investigate","invite","irritate","itch","jail","jam","jog","join","joke","judge","juggle","jump","justify","keep","kept","kick","kill","kiss","kneel","knit","knock","knot","know","label","land","last","laugh","launch","lay","lead","lean","leap","learn","leave","lecture","led","lend","let","level","license","lick","lie","lifted","light","lighten","like","list","listen","live","load","locate","lock","log","long","look","lose","love","maintain","make","man","manage","manipulate","manufacture","map","march","mark","market","marry","match","mate","matter","mean","measure","meddle","mediate","meet","melt","melt","memorize","mend","mentor","milk","mine","mislead","miss","misspell","mistake","misunderstand","mix","moan","model","modify","monitor","moor","motivate","mourn","move","mow","muddle","mug","multiply","murder","nail","name","navigate","need","negotiate","nest","nod","nominate","normalize","note","notice","number","obey","object","observe","obtain","occur","offend","offer","officiate","open","operate","order","organize","oriented","originate","overcome","overdo","overdraw","overflow","overhear","overtake","overthrow","owe","own","pack","paddle","paint","park","part","participate","pass","paste","pat","pause","pay","peck","pedal","peel","peep","perceive","perfect","perform","permit","persuade","phone","photograph","pick","pilot","pinch","pine","pinpoint","pioneer","place","plan","plant","play","plead","please","plug","point","poke","polish","pop","possess","post","pour","practice","praised","pray","preach","precede","predict","prefer","prepare","prescribe","present","preserve","preset","preside","press","pretend","prevent","prick","print","process","procure","produce","profess","program","progress","project","promise","promote","proofread","propose","protect","prove","provide","publicize","pull","pump","punch","puncture","punish","purchase","push","put","qualify","question","queue","quit","race","radiate","rain","raise","rank","rate","reach","read","realign","realize","reason","receive","recognize","recommend","reconcile","record","recruit","reduce","refer","reflect","refuse","regret","regulate","rehabilitate","reign","reinforce","reject","rejoice","relate","relax","release","rely","remain","remember","remind","remove","render","reorganize","repair","repeat","replace","reply","report","represent","reproduce","request","rescue","research","resolve","respond","restored","restructure","retire","retrieve","return","review","revise","rhyme","rid","ride","ring","rinse","rise","risk","rob","rock","roll","rot","rub","ruin","rule","run","rush","sack","sail","satisfy","save","saw","say","scare","scatter","schedule","scold","scorch","scrape","scratch","scream","screw","scribble","scrub","seal","search","secure","see","seek","select","sell","send","sense","separate","serve","service","set","settle","sew","shade","shake","shape","share","shave","shear","shed","shelter","shine","shiver","shock","shoe","shoot","shop","show","shrink","shrug","shut","sigh","sign","signal","simplify","sin","sing","sink","sip","sit","sketch","ski","skip","slap","slay","sleep","slide","sling","slink","slip","slit","slow","smash","smell","smile","smite","smoke","snatch","sneak","sneeze","sniff","snore","snow","soak","solve","soothe","soothsay","sort","sound","sow","spare","spark","sparkle","speak","specify","speed","spell","spend","spill","spin","spit","split","spoil","spot","spray","spread","spring","sprout","squash","squeak","squeal","squeeze","stain","stamp","stand","stare","start","stay","steal","steer","step","stick","stimulate","sting","stink","stir","stitch","stop","store","strap","streamline","strengthen","stretch","stride","strike","string","strip","strive","stroke","structure","study","stuff","sublet","subtract","succeed","suck","suffer","suggest","suit","summarize","supervise","supply","support","suppose","surprise","surround","suspect","suspend","swear","sweat","sweep","swell","swim","swing","switch","symbolize","synthesize","systemize","tabulate","take","talk","tame","tap","target","taste","teach","tear","tease","telephone","tell","tempt","terrify","test","thank","thaw","think","thrive","throw","thrust","tick","tickle","tie","time","tip","tire","touch","tour","tow","trace","trade","train","transcribe","transfer","transform","translate","transport","trap","travel","tread","treat","tremble","trick","trip","trot","trouble","troubleshoot","trust","try","tug","tumble","turn","tutor","twist","type","undergo","understand","undertake","undress","unfasten","unify","unite","unlock","unpack","untidy","update","upgrade","uphold","upset","use","utilize","vanish","verbalize","verify","vex","visit","wail","wait","wake","walk","wander","want","warm","warn","wash","waste","watch","water","wave","wear","weave","wed","weep","weigh","welcome","wend","wet","whine","whip","whirl","whisper","whistle","win","wind","wink","wipe","wish","withdraw","withhold","withstand","wobble","wonder","work","worry","wrap","wreck","wrestle","wriggle","wring","write"];
    //all articles
    articleList = [["a(n)","the", "a single", "a lonely", "a solitary"],["some","a number of", "a collection of", "a bunch of" ]];
   
     //all gui
    generateButton = gui.createCircleButton(400,450,50,downColour,upColour,upColour);
    isMetaphorCheckbox = gui.createCheckBox(375,520,50,50,downColour,upColour);

    generateButton.action = run;
    draw();
}

function run()
{
    lyricTopicLineOne = "";
    lyricTopicLineTwo = "";
    lyricTopicLineThree = "";

    //Choose between a Art-Adj-Noun pair, a Verb-Adj pair, or a Verb-Art-Adj-Noun combo
    var factor = Math.random() * 90;
    //if Art-Adj-Noun
    if(factor > 0 && factor <=30)
    {
        var article;
            var adjective;
            var noun;

            //set plural flag
            var fact = Math.round(Math.random());

            //choose article
            article = articleList[fact][Math.round(Math.random()*(articleList[fact].length-1))];
            
            //choose adjective
            adjective = adjList[Math.round(Math.random()*(adjList.length-1))];

            //choose noun
            noun = nounList[Math.round(Math.random()*(nounList.length-1))];
            var chars = noun.split('');
            if(chars[chars.length-1] == 's')
            {
               noun = '';
               for(var i = 0; i < chars.length -1;i++)
                {
                  noun += chars[i];
                }
            }
           
            if(fact == 1)
            {
                lyricTopicLineOne = article + " " + adjective + " " + noun + "s";
            }
            else
            {
                lyricTopicLineOne = article + " " + adjective + " " + noun + "";
            }

    }
    //if noun-Adj pair
    else if(factor>30 && factor <=60)
    {
        //important: add ing to the end. if it ends in 'e' cut the 'e'
        var noun;
        var verb;
        var article;

        //set plural flag
        var fact = Math.round(Math.random());

        //choose article
        article = articleList[fact][Math.round(Math.random()*(articleList[fact].length-1))];
        //choose verb
        verb = verbList[Math.round(Math.random()*(verbList.length-1))];
        //split verb
        var chars = verb.split('');
        //if verb ends in 'e'
        if(chars[chars.length-1] == 'e')
        {   
            verb = "";
            for(var i = 0; i < chars.length -1;i++)
            {
                verb += chars[i];
            }
            verb += 'ing';
        }
        else if((chars[chars.length-3] + chars[chars.length-2]+chars[chars.length-1]) != 'ing'
         && chars[chars.length-1] != 'y'
         && (chars[chars.length-2]+chars[chars.length-1]) != 'ed')
        {

            verb += 'ing';
        }
    
        

        //choose adjective
        noun = nounList[Math.round(Math.random()*(nounList.length-1))];
        chars = noun.split('');
        if(chars[chars.length-1] == 's')
        {
           noun = '';
           for(var i = 0; i < chars.length -1;i++)
            {
              noun += chars[i];
            }
        }
        
        

         if(fact == 1)
        {
            lyricTopicLineOne = article + " " + verb + " " + noun + "s";
        }
        else
        {
            lyricTopicLineOne = article + " " + verb + " " + noun + "";
        }

    }
    //if Verb-Art-Adj-Noun
    else if(factor>60 && factor <=90)
    {
        //important: add ing to the end. if it ends in 'e' cut the 'e'
        var noun;
        var verb;
        var article;
        var adjective;

        //set plural flag
        var fact = Math.round(Math.random());

        //choose article
        article = articleList[fact][Math.round(Math.random()*(articleList[fact].length-1))];
        //choose verb
        verb = verbList[Math.round(Math.random()*(verbList.length-1))];

        //split verb
        var chars = verb.split('');
        //if verb ends in 'e'
        if(chars[chars.length-1] == 'e')
        {   
            verb = "";
            for(var i = 0; i < chars.length -1;i++)
            {
                verb += chars[i];
            }
            verb += 'ing';
        }
        else if((chars[chars.length-3] + chars[chars.length-2]+chars[chars.length-1]) != 'ing'
         && chars[chars.length-1] != 'y'
         && (chars[chars.length-2]+chars[chars.length-1]) != 'ed')
        {

            verb += 'ing';
        }
    
        

        //choose adjective
        noun = nounList[Math.round(Math.random()*(nounList.length-1))];
        chars = noun.split('');
        if(chars[chars.length-1] == 's')
        {
           noun = '';
           for(var i = 0; i < chars.length -1;i++)
            {
              noun += chars[i];
            }
        }
        
        adjective = adjList[Math.round(Math.random()*(adjList.length-1))];

         if(fact == 1)
        {
            lyricTopicLineOne =  verb + " " + article + " " + adjective + " " + noun + "s";
        }
        else
        {
            lyricTopicLineOne = verb +  " " + article + " " + adjective + " " + noun + "";
        }

    }

    //end if


    //if the user checked "metaphor" generate "as a metaphor for" label 
    if(isMetaphorCheckbox.checked)
    {
        lyricTopicLineTwo = "as a metaphor for \n\n";
         //Choose between a Art-Adj-Noun pair, a Verb-Adj pair, or a Verb-Art-Adj-Noun combo
        factor = (Math.random() * 90) + 1;
         if(factor > 0 && factor <=30)
        {
            var article;
                var adjective;
                var noun;

                //set plural flag
                var fact = Math.round(Math.random());

                //choose article
                article = articleList[fact][Math.round(Math.random()*(articleList[fact].length-1))];
                
                //choose adjective
                adjective = adjList[Math.round(Math.random()*(adjList.length-1))];

                //choose noun
                noun = nounList[Math.round(Math.random()*(nounList.length-1))];
                var chars = noun.split('');
                if(chars[chars.length-1] == 's')
                {
                   noun = '';
                   for(var i = 0; i < chars.length -1;i++)
                    {
                      noun += chars[i];
                    }
                }
               
                if(fact == 1)
                {
                    lyricTopicLineThree = article + " " + adjective + " " + noun + "s";
                }
                else
                {
                    lyricTopicLineThree = article + " " + adjective + " " + noun + "";
                }

        }
        //if noun-Adj pair
        else if(factor>30 && factor <=60)
        {
            //important: add ing to the end. if it ends in 'e' cut the 'e'
            var noun;
            var verb;
            var article;

            //set plural flag
            var fact = Math.round(Math.random());

            //choose article
            article = articleList[fact][Math.round(Math.random()*(articleList[fact].length-1))];
            //choose verb
            verb = verbList[Math.round(Math.random()*(verbList.length-1))];
            //split verb
            var chars = verb.split('');
            //if verb ends in 'e'
            if(chars[chars.length-1] == 'e')
            {   
                verb = "";
                for(var i = 0; i < chars.length -1;i++)
                {
                    verb += chars[i];
                }
                verb += 'ing';
            }
            else if((chars[chars.length-3] + chars[chars.length-2]+chars[chars.length-1]) != 'ing'
             && (chars[chars.length-2]+chars[chars.length-1]) != 'ed')
            {

                verb += 'ing';
            }
        
            

            //choose adjective
            noun = nounList[Math.round(Math.random()*(nounList.length-1))];
            chars = noun.split('');
            if(chars[chars.length-1] == 's')
            {
               noun = '';
               for(var i = 0; i < chars.length -1;i++)
                {
                  noun += chars[i];
                }
            }
            
            

             if(fact == 1)
            {
                lyricTopicLineThree = article + " " + verb + " " + noun + "s";
            }
            else
            {
                lyricTopicLineThree = article + " " + verb + " " + noun + "";
            }

        }
        //if Verb-Art-Adj-Noun
        else if(factor>60 && factor <=90)
        {
            //important: add ing to the end. if it ends in 'e' cut the 'e'
            var noun;
            var verb;
            var article;
            var adjective;

            //set plural flag
            var fact = Math.round(Math.random());

            //choose article
            article = articleList[fact][Math.round(Math.random()*(articleList[fact].length-1))];
            //choose verb
            verb = verbList[Math.round(Math.random()*(verbList.length-1))];

            //split verb
            var chars = verb.split('');
            //if verb ends in 'e'
            if(chars[chars.length-1] == 'e')
            {   
                verb = "";
                for(var i = 0; i < chars.length -1;i++)
                {
                    verb += chars[i];
                }
                verb += 'ing';
            }
            else if((chars[chars.length-3] + chars[chars.length-2]+chars[chars.length-1]) != 'ing'
             && (chars[chars.length-2]+chars[chars.length-1]) != 'ed')
            {

                verb += 'ing';
            }
        
            

            //choose adjective
            noun = nounList[Math.round(Math.random()*(nounList.length-1))];
            chars = noun.split('');
            if(chars[chars.length-1] == 's')
            {
               noun = '';
               for(var i = 0; i < chars.length -1;i++)
                {
                  noun += chars[i];
                }
            }
            
            adjective = adjList[Math.round(Math.random()*(adjList.length-1))];

             if(fact == 1)
            {
                lyricTopicLineThree =  verb + " " + article + " " + adjective + " " + noun + "s";
            }
            else
            {
                lyricTopicLineThree = verb +  " " + article + " " + adjective + " " + noun + "";
            }

        }
        else
        {
            lyricTopicLineThree = "Harrison Alexander Hutcheon";
        }
            //end if
    }
    //end if

    //draw
    draw();

}

function draw()
{
    //draw background 
    drawRect(0, 0, canvas.width, canvas.height, "black");
    //draw text 
    drawSmallText(lyricTopicLineOne,50,100,'white');
    drawSmallText(lyricTopicLineTwo,50,200,'white');
    drawSmallText(lyricTopicLineThree,50,300,'white');

    drawSmallText("Generate!",generateButton.x - generateButton.size,generateButton.y - generateButton.size - 20,'white');
    drawSmallText("Is Metaphorical",isMetaphorCheckbox.x - isMetaphorCheckbox.width,isMetaphorCheckbox.y + isMetaphorCheckbox.height + 20 ,'white');
    gui.draw();
    drawTinyText(isMetaphorCheckbox.checked,isMetaphorCheckbox.x + isMetaphorCheckbox.width/4,isMetaphorCheckbox.y + isMetaphorCheckbox.height/3,'white');
    
}


      