let Promise = require('bluebird');
const fs = require('fs');
const output = fs.createWriteStream('./stdout.log', {defaultEncoding: 'utf8', autoClose: true, flags: 'a'});
const errorOutput = fs.createWriteStream('./stderr.log', {defaultEncoding: 'utf8', autoClose: true, flags: 'a'});
const {Console} = require('console');
const fileLogger = new Console(output, errorOutput);

const TelegramBot = require('node-telegram-bot-api');

const translate = require('google-translate-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = '311727287:AAH_ZXvV_A3HovDcaNJiW0UCC5XNFCsc6N4';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});
var waiting = {};

// var userState = (function($this){

// $this.states = ['', 'customer', 'translator', 'admin'];

// 	return {
// 		get: function() {
// 			if ($this.state) {return $this.state;} else { return $this.state = $this.states[0]};
// 		},

// 		set: function(state) {
// 			$this.state = $this.states[Number(state)];
// 		}
// 	};
// }(this));

// class Project {

// 	constructor (user) {
// 		this.project = {};
// 		this.project.user = user ? user : '';
// 		this.step = 0;
// 	}
// 	setUser(user) {
// 		this.project.user = user;
// 	}
// 	getUser() {
// 		return this.project.user;
// 	}
// 	setProjectType(type) {
// 		this.project.type = type;
// 		this.step = 2;
// 		return;
// 	}
// 	setProjectDeadline(time) {
// 		this.step = 4;
// 		return this.project.deadline = time;
// 	}
// 	setProjectDocuments(doc) {
// 		if (this.project.docs) {this.project.docs.push(doc) } else {this.project.docs = [doc]};
// 		this.step = 3;
// 		return;
// 	}
// 	setProjectDescription(desc) {
// 		this.project.desc = desc;
// 		this.step = 5;
// 		return;
// 	}
// 	setProjectFinallized() {
// 		return this.project.final = true;
// 	}
// 	getProject() {
// 		return this.project;
// 	}
// 	getStep() {
// 		return this.step;
// 	}


// }

// Fetching bot update
// bot.getUpdates({allowed_updates: 'message', limit: 100, offset: 1}).then(res => {
// 	console.log(res);
// }, err => console.log(err))


// bot.on('inline_query', (q) => {

// 	bot.answerInlineQuery(q.id, [{
// 		type: 'article',
// 		id: q.id,
// 		title: q.query,
// 		input_message_content: {message_text: 'got your message'}
// 	}]);
// })


bot.on('message', (msg) => {
	if (msg.text && msg.text.match(/\/start/)) {
		homePage(msg);
	} else {	
		bot.sendChatAction(msg.chat.id, 'typing');
		waiting.msg = 'در حال دریافت اطلاعات ...';
		bot.sendMessage(msg.chat.id, waiting.msg).then(function(r){
			waiting.chat_id = r.chat.id,
			waiting.message_id = r.message_id
		});

		if (msg.text) tsp(msg).then(function(res){
			console.log(res);
			bot.editMessageText(msg.text + '	--->	' + res,{chat_id: waiting.chat_id,message_id:  waiting.message_id});
		})
		.catch(function(err){
			console.log(err);
		})
	}
}, (err) => {
	console.log(err);
	return;
})

// var locale = {newProject:'ثبت پروژه جدید', quoteProject: 'برآورد قیمت', isTranslator: 'مترجم هستید ؟', docUplaod: 'حالا فایل های خود را آپلود کنید', docUploadError: 'پروژه ای برای شما وجود ندارد , پروژه چدید شروع کنید' }

// bot.onText(/\/logProject/, (msg) => {
// 	if (this.project) {
// 		bot.sendMessage(msg.chat.id, "Last log :" + JSON.stringify(this.project.getProject()));
// 	}
// })

function homePage(msg) {
	bot.sendMessage(msg.chat.id, "کلمه یا متن مورد نظر خود را ارسال کنید");
}

// bot.onText(/خانه/, (msg) => {homePage(msg)})

// bot.onText(/./, (msg) => {
// 	fileLogger.log(msg);
// })

// bot.onText(/\/state/, (msg) => {
// 	bot.sendMessage(msg.chat.id, `last state : ${userState.get()}`);
// })

// bot.onText(/\/start/, (msg) => {
// 	// userState.set(0);
// 	homePage(msg);
// })

// bot.on('callback_query', (msg) => {
// 	if (msg.data == 'today') {
// 		// bot.answerCallbackQuery(msg.id, 'بنظر میرسه خیلی عجله دارین :)');
// 		bot.sendMessage(msg.message.chat.id, 'اوکی :)', {reply_markup: {"force_reply": true}})
// 	}
// })


// bot.on('message', (msg) => {
// 	// console.log(msg);

// 	let story = ' <a href="https://d267cvn3rvuq91.cloudfront.net/i/images/dsc0409.jpg">&#8205</a>';
	

// bot.sendMessage(msg.chat.id, `فایل شما با موفقیت دریافت شد, حال زمان مورد نظرتان را برای تحویل ترجمه انتخاب کنید`, {reply_markup: {"inline_keyboard": [[{"text": 'امروز', "callback_data": 'today'}, {"text": 'فردا', "callback_data": 'tomorrow'}], [{"text": 'این هفته', "callback_data": 'thisWeek'}]]}});
// // bot.sendMessage(msg.chat.id, story , {parse_mode:'html', reply_markup: {"keyboard": [[{text: "شماره تماس", request_contact: true}]]}});
// // bot.sendVoice(msg.chat.id, 'BQADBAAD7AADN-hgUxzJsCaEKwTNAg', {caption: 'گوش بده بش'});

// 	if (msg.document) {
// 		if (userState.get() == 'customer') {  // customer state
// 			if (this.project.getStep() == 2) { // upload first doc
// 				this.project.setProjectDocuments(msg.document)
// 				bot.sendMessage(msg.chat.id, `فایل شما با موفقیت دریافت شد, حال زمان مورد نظرتان را برای تحویل ترجمه انتخاب کنید`, {reply_markup: {"inline_keyboard": [[{"text": 'امروز', "callback_data": 'today'}, {"text":'فردا'}], ['همین هفته', 'هفته آینده'], ['فرقی ندارد']]}});

				
// 			} else if (this.project.getStep() == 3) { // uploading additional docs
// 				this.project.setProjectDocuments(msg.document)
// 				bot.sendMessage(msg.chat.id, `فایل با موفقیت آپلود شد`)
// 			} else {
// 				bot.sendMessage(msg.chat.id, locale.docUploadError)
// 			}
// 		} else if (userState.get() == 'translator') {
// 			bot.sendMessage(msg.chat.id, `مترجم عزیز فایل شما دریافت شد`);
// 		}
// 	}

// 	if (msg.text) {
// 		if (userState.get() === '') { // no state yet
// 			if (msg.text.includes(locale.isTranslator)) {
// 				userState.set(2);
// 				bot.sendMessage(msg.chat.id, 'choose one of the options', {reply_markup: {"keyboard": [['ثبت نام کنید'], ['انصراف']]}});	

// 			} else if (msg.text.includes(locale.newProject)){
// 				var projectTypeKeyboard = [["عمومی", "تخصصی"], ["دانشجویی", "سازمانی"],["خانه"]];
				
// 				userState.set(1);
// 				this.project = new Project(msg);

// 				bot.sendMessage(msg.chat.id, 'got your msg, new project is allocated fo yo', {reply_markup: {"keyboard": projectTypeKeyboard}})
// 			}
// 		} 

// 		else if (userState.get() === 'customer') { // Customer state

// 			if (msg.text.includes(locale.quoteProject)) {
// 				// console.log(userClass.getUser());
// 				// bot.sendMessage(msg.chat.id, userClass.getUser())
// 			} else if (msg.text.includes('عمومی')) {
// 				console.log(`${userState.get()}`);
// 				this.project.setProjectType('عمومی');
// 				bot.sendMessage(msg.chat.id, locale.docUplaod, {reply_markup: {"remove_keyboard": true}})
// 			} else if (msg.text.includes('تخصصی')) {
// 				this.project.setProjectType('تخصصی');
// 				bot.sendMessage(msg.chat.id, locale.docUpload, {reply_markup: {"remove_keyboard": true}})
// 			} else if (msg.text.includes('دانشجویی')) {
				
// 				// bot.sendMessage(msg.chat.id, 'لطفن شماره خود را وارد کنید ', {reply_markup: {"text": "شماره تماس", "request_contact": true}})
// 			} else if (msg.text.includes('امروز')) {
// 				setProjectDeadline('امروز');
// 				bot.sendMessage(msg.chat.id, `در آخرین مرحله اگر می خواهید توضیحاتی در رابطه با پروژه خود دارید را بنویسید`);
// 			} else if (msg.text.includes('فردا')) {
// 				setProjectDeadline('فردا');
// 				// bot.sendMessage
// 			}
// 		} else if (userState.get() === 'translator') { // translator state

// 			if (msg.text.includes('ثبت نام')) {
// 				bot.sendMessage(msg.chat.id, 'ok i got it your\' a hard head !');
// 			} else if (msg.text.includes('انصراف')) {
// 				bot.sendMessage(msg.chat.id, 'why !? , really ??? ');
// 			}
// 		}
// 	}
// })


// function projectFinalized(msg) {
// 	bot.sendMessage(msg.chat.id, `Congratulation ! your project added successfully`);
// }

function tsp(msg) {
	return new Promise(function (resolve, reject) {
		translate(msg.text, {to: 'fa'}).then( res => {
			// bot.sendMessage(msg.chat.id,res.text)
			resolve(res.text);
		})
		.catch(err => {
			// reject(bot.sendMessage(msg.chat.id, 'something went badly wrong dude !'));
			reject(err);
		})
		
	})
}

