
var BASE64_MARKER = ';base64,';

function convertDataURIToBinary(dataURI) {
  var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
  var base64 = dataURI.substring(base64Index);
  var raw = window.atob(base64);
  var rawLength = raw.length;
  var array = new Uint8Array(new ArrayBuffer(rawLength));

  for(i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i);
  }
  return array;
}

function delay(callback, ms) {
  var timer = 0;
  return function() {
    var context = this, args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      callback.apply(context, args);
    }, ms || 0);
  };
}

function truncateString(str, length) {
     return str.length > length ? str.substring(0, length - 3) + '...' : str
  }


function pickDraft(){
  console.log("run pickDraft")
  $('.draft-card.pick').removeClass('pick')
  $(this).parent().addClass('pick')
}

function createDraft(){
  console.log("run createDraft")
  var length = $('.draft-card').length+1
  $('.draft-card.pick').removeClass('pick')
  $('<div class="draft-card pick" draft-index="'+length+'"><div class="draft-text">Draft '+length+'</div><img src="https://uploads-ssl.webflow.com/62290cff51755e73b77cfb7d/623c8d3a301ee705657d68f0_close999.svg" loading="lazy" alt="" class="close-draft"></div>').insertBefore( ".new-draft" )
  $('#text-input').val('').attr('placeholder','The start of something new!')
}

function deleteDraft(){
  console.log("run deleteDraft")
  var current = $(this).parent()
  if($(this).attr('class')=='draft-card.pick'){
    console.log('currently selected')
    var prev = current.prev()
    var next = current.next()
    if (prev.attr('class')=='draft-card'){
      prev.addClass('pick')
    } else if (next.attr('class')=='draft-card'){
      var rep = next
    } else {
      console.log("no other drafts")
    }
  }
  current.remove()
}

function setCookie(cName, cValue, expDays) {
        let date = new Date();
        date.setTime(date.getTime() + (expDays * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = cName + "=" + cValue + "; " + expires + "; path=/";
}

function clearCookie(cName){
  document.cookie = cName+"=''; path=/; max-age=0; expires=0";
}

function getCookie(cName) {
      const name = cName + "=";
      const cDecoded = decodeURIComponent(document.cookie); //to be careful
      const cArr = cDecoded .split('; ');
      let res;
      cArr.forEach(val => {
          if (val.indexOf(name) === 0) res = val.substring(name.length);
      })
      return res;
}

function loadPage(){
  console.log(getCookie("user_id"))
  console.log(getCookie("text"))
  if (getCookie("user_id")==undefined){
    let id = Date.now()+"-"+Math.random()
    setCookie("user_id",id,30)
  }
  if (getCookie("text")!==undefined){
    console.log("text found")
    var text = decodeURIComponent(getCookie("text"))
    $('#text-input').val(text)
  }
}

async function readBack(input,lang,voice,speed,pitch,char_count,id){
  console.log('submitted')
  var text = $('#input').val()
  $.ajax({
    type: "POST",
    url: 'https://hook.integromat.com/v6ukq3b1v2jorb3hfifvjg9lh4xp3p2y',
    dataType: "json",
    data: {text: input,languageCode: lang,voice:voice,pitch:pitch ,speakingRate: speed,char:char_count,user:id},
    success: function (data) {
      console.log("return data")
      console.log(data)
      var workdata = "data:audio/LINEAR16;base64,"+data;
      var binary = convertDataURIToBinary(workdata);
      var blob = new Blob([binary], {type : 'audio/mp3'});
      var blobUrl = URL.createObjectURL(blob);
      $('#audio').attr('src',blobUrl)
      console.log(blobUrl)
      $("#audio")[0].pause();
      $("#audio")[0].load();//suspends and restores all audio element
      $("#audio")[0].oncanplaythrough = $("#audio")[0].play();
    },
    error: function (err) {
      console.log("return data but error")
      console.log(err)
      var workdata = "data:audio/LINEAR16;base64,"+err.responseText;
      var binary = convertDataURIToBinary(workdata);
      var blob = new Blob([binary], {type : 'audio/mp3'});
      var blobUrl = URL.createObjectURL(blob);
      $('#read-that-back').css('opacity','80%')
      $('#read-that-back').find('div').html("Playing")
      $('#read-that-back-mobile').css('opacity','80%')
      $('#read-that-back-mobile').find('div').html("Playing")
      $('#audio').attr('src',blobUrl)
      console.log(blobUrl)
      $("#audio")[0].pause();
      console.log("paused!") 
      $("#audio")[0].load();//suspends and restores all audio element
      console.log("loaded!") 
      $("#audio")[0].oncanplaythrough = $("#audio")[0].play();
      console.log("played!")   
    }
  })
}

loadPage()

$('#read-that-back').click(function(){
  var lang = $('#voice').find('.select-button.selected').attr('data-lang')
  var voice = $('#voice').find('.select-button.selected').attr('data-value')
  var speed = $('#speed').find('.select-button.selected').attr('data-value')
  var pitch = $('#voice').find('.select-button.selected').attr('data-ptich')
  var input = $('#text-input').val()
  var inputlength = input.length
  console.log("lang = "+lang)
  console.log("voice = "+voice)
  console.log("speed = "+speed)
  console.log("pitch = "+pitch)
  console.log("input = "+input)
  $('#read-that-back-mobile').css('opacity','20%')
  $('#read-that-back').css('opacity','20%')
  $('#read-that-back').find('div').html("Waiting...")
  $('#read-that-back-mobile').find('div').html("Waiting...")
  var id = getCookie("user_id")
  console.log("id = "+id)
  if (inputlength<5000 && inputlength>0) {
    readBack(input,lang,voice,speed,pitch,inputlength,id)
  }
})

$('#read-that-back-mobile').click(function(){
  $('#read-that-back').find('div').html("Waiting...")
  var lang = $('#voice').find('.select-button.selected').attr('data-lang')
  var voice = $('#voice').find('.select-button.selected').attr('data-value')
  var speed = $('#speed').find('.select-button.selected').attr('data-value')
  var pitch = $('#voice').find('.select-button.selected').attr('data-ptich')
  var input = $('#text-input').val()
  var inputlength = input.length
  console.log("lang = "+lang)
  console.log("voice = "+voice)
  console.log("speed = "+speed)
  console.log("pitch = "+pitch)
  console.log("input = "+input)
  $('#read-that-back-mobile').css('opacity','20%')
  $('#read-that-back').css('opacity','20%')
  $('#read-that-back').find('div').html("Waiting...")
  $('#read-that-back-mobile').find('div').html("Waiting...")
  var id = getCookie("user_id")
  if (inputlength<5000 && inputlength>0) {
    readBack(input,lang,voice,speed,pitch,inputlength,id)
  }
})

//Highlight Text Play on keypress
$(document).bind('keydown', function(e) {
    if( e.which === 13 && e.metaKey ) {
      console.log("you selected:")
      console.log(document.getSelection().toString())
      $('#read-that-back').find('div').html("Waiting...")
      var lang = $('#voice').find('.select-button.selected').attr('data-lang')
      var voice = $('#voice').find('.select-button.selected').attr('data-value')
      var speed = $('#speed').find('.select-button.selected').attr('data-value')
      var pitch = $('#pitch').find('.select-button.selected').attr('data-value')
      var input = document.getSelection().toString()
      var inputlength = input.length
      console.log("lang= "+lang)
      console.log("voice= "+voice)
      console.log("speed= "+speed)
      console.log("pitch= "+pitch)
      console.log("input= "+input)
      if (inputlength<5000) {
        readBack(input,lang,voice,speed,pitch,inputlength)
      }
    }
});


$('.select-button').click(function(){
  $(this).siblings().removeClass('selected')
  $(this).addClass('selected')
})

//measurements
$('#text-input').keyup(function(){
	var words = $.trim($('#text-input').val()).split(' ').filter(function(v){return v!==''}).length
  var inputVal = $('#text-input').val()
  var sentences = inputVal.split('.').length;
  var inputlength = inputVal.length
  var nospaces = inputVal.replace(/\s+/g, '').length
  var paragraphs = inputVal.split('\n\n').length
  var readability = 4.71*(nospaces/words)+0.5*(words/sentences)-21.43
  if (readability !== 0) {
    var ARI = readability.toFixed(0)
  } else {
    var ARI = 0
  }
  //var wpm = $('#voice').find('.select-button.selected').attr('data-wpm')
  var wpm = 300
  var all_seconds = (words/wpm*60).toFixed(0)
  var minutes = Math.floor(all_seconds/60)
  var seconds = all_seconds-(60*minutes)
  if (seconds/10 < 1) {
    var seconds_print = "0" + seconds
  } else {
    var seconds_print = seconds
  }
  var time = minutes+":"+seconds_print
  $('#time').html(time)
  $('#words').html(words)
  $('#char').html(inputlength)
  $('#grade').html(ARI)
})

//autosave
$('#text-input').keyup(delay(function (e) {
  var current = $('.draft-card.pick')
  var text = encodeURIComponent(this.value)
  var title = truncateString(this.value, 30)
  var index = current.attr('draft-index')
  console.log(text)
  setCookie('text', text, 30)
  current.data('text',text)
  current.data('title',title)
  if(title.length!==0){
    current.find('.draft-text').html(title)
  } else {
    current.find('.draft-text').html("Draft "+index)
  }
  console.log("autosave complete!")
  $('.notification').css('opacity','100%')
}, 2000)
);

$('#canvas').click(function(){
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    console.log("mobile")
  } else {
    $('#text-input').focus()
  }
})

$('#text-input').focus(function(){
	$(this).attr('placeholder','')
})

$('#font-up').click(function(){
  var current = $('#text-input').css('font-size')
  let up = parseFloat(current)+1
  $('#text-input').css('font-size',up)
})

$('#font-down').click(function(){
  var current = $('#text-input').css('font-size')
  let up = parseFloat(current)-1
  $('#text-input').css('font-size',up)
})

$('.type-button').click(function(){
  if ($(this).attr('data-type')=="serif"){
    $('#text-input').css('font-family','Merriweather')
  } else if ($(this).attr('data-type')=="sans-serif"){
    $('#text-input').css('font-family','Gotham book')
  } else if ($(this).attr('data-type')=="mono"){
    $('#text-input').css('font-family','Courier Prime')
  }
})

$('#audio').on('ended',function(){
  $('#read-that-back').css('opacity','100%')
  $('#read-that-back').find('div').html("Read That Back")
  $('#read-that-back-mobile').css('opacity','100%')
  $('#read-that-back-mobile').find('div').html("Read That Back")
})

$('.new-draft').click(createDraft)
$('.draft').on('click','.draft-text',pickDraft)
$('.draft').on('click','.close-draft',deleteDraft)

$('.uni').click(function(){
  if($(this).attr('data-status')==0){
    $(this).find('.icon').attr('src','https://uploads-ssl.webflow.com/62290cff51755e73b77cfb7d/623bf13cd157aa43b235f4f4_close%20purp.svg')
    $(this).attr('data-status',1)
  } else {
    $(this).find('.icon').attr('src','https://uploads-ssl.webflow.com/62290cff51755e73b77cfb7d/623bf13c7f6bae6d22fa56d7_school.svg')
    $(this).attr('data-status',0)
  }
})

$('.uni.lesson').click(function(){
  var op = $(this).find('span')
  var url = op.attr('data-file')
  var text = op.html()
  console.log(url)
  console.log(text)
  $('#text-input').val(text)
  $('#audio').attr('src',url)
  $('#audio')[0].pause();
  $('#audio')[0].load();
  $('#audio')[0].oncanplaythrough =  $('#audio')[0].play();
})

console.log('heelo')
