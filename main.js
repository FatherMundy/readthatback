
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

$('#audio').on('ended',function(){
  $('#read-that-back').css('opacity','100%')
  $('#read-that-back').find('div').html("Read That Back")
  $('#read-that-back-mobile').css('opacity','100%')
  $('#read-that-back-mobile').find('div').html("Read That Back")
})