// packing payload for KEvent https://kata-ai.keep.edu.hk/kevent/kevent.js
//
function aia_send(eid)
{
    var aia_payload;

    switch(aia_cid) {

        case "Chapter7::Skill-based Stopping":
            switch(eid) {
                case "incorrectStop":
                case "correctStop":
                case "brake":
                case "exitGame":
                case "sessionTimeout":
                    aia_payload = JSON.stringify({correctStop:correctStop,incorrectStop:incorrectStop,speedOrg:Math.round(speedOrg / fps / 2)});    
                    break;                    
                case "startGame":                    
                    aia_payload = "{}";
                    break
                default:
            };    
            break; 

        case "Chapter7::Rule-based Stopping":
        case "Chapter7::Rule-based Stopping Own Rules": 
            //initial value to avoid DOM unable to get the value
            stage0_0 = "Light Brake";
            stage0_1 = "Light Brake";
            stage0_2 = "No Brake";
            stage1_0 = "Hard Brake";
            stage1_1 = "Light Brake";
            stage1_2 = "No Brake";
            stage2_0 = "Hard Brake";
            stage2_1 = "Light Brake";
            stage2_2 = "Light Brake";    
            switch(eid) {
                case "incorrectStop":
                case "correctStop":
                case "reset":
                case "shortDistance":
                case "lowSpeed":
                // case "midSpeed":
                case "weather":
                case "exitGame":                    
                case "captureSave":
                case "sessionTimeout":
                    shortDistance = document.getElementById("shortDistance").value;
                    lowSpeed = document.getElementById("lowSpeed").value;
                    // midSpeed = document.getElementById("midSpeed").value;
                    currentSpeed = document.getElementById("speedDisplay").innerText;
                    currentDistance = document.getElementById("distanceDisplay").innerText;
                    if (document.getElementById("stage0_0") != null){
                        stage0_0 = document.getElementById("stage0_0").value;
                    }
                    if (document.getElementById("stage0_1") != null){
                        stage0_1 = document.getElementById("stage0_1").value;
                    }
                    if (document.getElementById("stage0_2") != null){
                        stage0_2 = document.getElementById("stage0_2").value;
                    }
                    if (document.getElementById("stage1_0") != null){
                        stage1_0 = document.getElementById("stage1_0").value;
                    }
                    if (document.getElementById("stage1_1") != null){
                        stage1_1 = document.getElementById("stage1_1").value;
                    }
                    if (document.getElementById("stage1_2") != null){
                        stage1_2 = document.getElementById("stage1_2").value;
                    }
                    if (document.getElementById("stage2_0") != null){
                        stage2_0 = document.getElementById("stage2_0").value;
                    }
                    if (document.getElementById("stage2_1") != null){
                        stage2_1 = document.getElementById("stage2_1").value;
                    }
                    if (document.getElementById("stage2_2") != null){
                        stage2_2 = document.getElementById("stage2_2").value;  
                    }                  
                    aia_payload = JSON.stringify({correctStop:correctStop,incorrectStop:incorrectStop,speedOrg:Math.round(speedOrg / fps / 2),
                        shortDistance:shortDistance,
                        currentSpeed:currentSpeed, currentDistance:currentDistance,
                        stage0_0:stage0_0,stage0_1:stage0_1,stage0_2:stage0_2,
                        stage1_0:stage1_0,stage1_1:stage1_1,stage1_2:stage1_2,
                        stage2_0:stage2_0,stage2_1:stage2_1,stage2_2:stage2_2,
                        weather:window.weather, redLightStatus:redLightStatus                                               
                    });    
                    break;
                case "startGame":                    
                    aia_payload = "{}";
                    break                    
                default:
            };    
            break;

            case "Chapter7::Knowledge-based stopping FullAI":
                switch(eid) {
                    case "incorrectStop":
                    case "correctStop":                    
                    case "goAI":
                    case "weather":
                    case "exitGame": 
                    case "sessionTimeout":                       
                    //case "brake":
                        runningMode = document.getElementById('runningMode').innerText
                        currentSpeed = document.getElementById("speedDisplay").innerText;
                        currentDistance = document.getElementById("distanceDisplay").innerText;
                        aia_payload = JSON.stringify({
                            runningMode:runningMode,
                            currentSpeed:currentSpeed, currentDistance:currentDistance,
                            weather:window.weather, redLightStatus:redLightStatus  
                        });    
                        break;
                    case "startGame":                    
                        aia_payload = "{}";
                        break                        
                    default:
                };    
                break;            

            case "Chapter7::Knowledge-based stopping":
                switch(eid) {
                    case "incorrectStop":
                    case "correctStop":                    
                    case "dataCollection":
                    case "startTraining":
                    case "endTraining":
                    case "modelEvaluation":
                    case "weather":
                    case "exitGame":   
                    case "sessionTimeout":                     
                    //case "brake":
                        currentSpeed = document.getElementById("speedDisplay").innerText;
                        currentDistance = document.getElementById("distanceDisplay").innerText;
                        samples = document.getElementById("samples").innerText;
                        aia_payload = JSON.stringify({
                            currentSpeed:currentSpeed, currentDistance:currentDistance,
                            samples:samples, weather:window.weather, redLightStatus:redLightStatus  
                        });    
                        break;
                    case "startGame":                    
                        aia_payload = "{}";
                        break                        
                    default:
                };    
                break;            

        default:
    }

    if (typeof aia_uid === 'undefined') 
    {
    	kevent_send('cookie', aia_cid, eid, aia_payload);            
    } else {
     	kevent_send(aia_uid, aia_cid, eid, aia_payload);            
    }
};	    

function ScreenCap(filename,conditions) {

  html2canvas(document.querySelector("#wrapper"), {
    useCORS: true,
  }).then(function (canvas) {
    var imageURL = canvas.toDataURL("image/png");
    let a = document.createElement("a");
    a.href = imageURL;
    if (typeof aia_uid === 'undefined') 
    {
      aia_uid = local_getCookie('aia_uid');
      if(aia_uid == null)
        aia_uid = "anonymous";
    };
    if (conditions == null)
    {
        a.download = filename+aia_uid+".png";
    } else  {
        a.download = filename+aia_uid+"_"+conditions+".png";
    }

    a.click();
  });
  aia_send("captureSave");
}

function local_getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}

function start_timer(){
    var duration = 3600;
    // Set the date we're counting down to
    var now = new Date();

    var countDownDate = new Date().getTime()+ duration * 1000 ;

    // Update the count down every 1 second
    var x = setInterval(function() {

      // Get today's date and time
      var now = new Date().getTime();
        
      // Find the distance between now and the count down date
      var distance = countDownDate - now;
        
      // Time calculations for days, hours, minutes and seconds
      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
      // Output the result in an element with id="demo"
      document.getElementById("timer").innerHTML =hours + "h "+ minutes + "m " + seconds + "s ";
        
      // If the count down is over, write some text 
      if (distance < 0) {
        clearInterval(x);
        document.getElementById("timer").innerHTML = "This session is ended. ";
        aia_send("sessionTimeout");
        window.history.back();
      }
    }, 1000);
}