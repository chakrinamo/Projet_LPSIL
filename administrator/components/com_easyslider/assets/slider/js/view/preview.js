void function(exports,$){exports.JSNES_PreviewView=Backbone.View.extend({constructor:function JSNES_PreviewView(){Backbone.View.apply(this,arguments)},initialize:function(options){log(this);this.options=options||{};this.uriPrefix=$(".jsn-es-app").attr("data-uri");this.render()},events:{click:function(){this.$el.addClass("hidden");this.$(".jsn-es-preview").empty()}},render:function(){var data=this.model.toJSON();console.log(this.$el.find(".jsn-es-slide").get(0));var settings=this.options.settings;settings.canvasWidth=this.options.canvasWidth;settings.canvasHeight=this.options.canvasHeight;this.$el.removeClass("hidden").find(".jsn-es-preview").html(this.renderSlide(data,settings));this.previewView=new SliderSlideView({el:this.$el.find(".jsn-es-slide").get(0),index:0,autoplayVideo:true});console.log(this.previewView);this.previewView.$el.removeClass("hidden");this.previewView.activateItems();this.$(".video-player").JSNES_VideoItem();this.$("[autoplay].video-player").JSNES_VideoItem("play")},microtime:function(get_as_float){return(new Date).getTime();var now=(new Date).getTime()/1e3;var s=parseInt(now,10);return get_as_float?now:Math.round((now-s)*1e3)/1e3+" "+s},renderSlide:function(slide,settings){log(settings);var backgroundColor,backgroundImage,backgroundPosition,backgroundSize,transition,items;var index=slide.index;if(slide.backgroundColor)backgroundColor=slide.backgroundColor;if(slide.backgroundImage)backgroundImage=slide.backgroundImage;if(slide.backgroundPosition)backgroundPosition=slide.backgroundPosition;if(slide.backgroundSize)backgroundSize=slide.backgroundSize;if(slide.transition)transition=slide.transition;if(slide.items)items=slide.items;var esTransition="";var html="";if(settings.fullWidth&&settings.fullWidth){var background="width: 100%;height: "+settings.canvasHeight+";"}else{var background="width: "+settings.canvasWidth+";height: "+settings.canvasHeight+";"}var backgroundURL=backgroundImage.type=="extend"?backgroundImage.url:this.uriPrefix+backgroundImage.url;if(backgroundColor)background+="background-color: "+backgroundColor+";";if(backgroundImage)background+="background-image: url("+backgroundURL+");";if(backgroundPosition)background+="background-position: "+backgroundPosition+";";if(backgroundSize)background+="background-size: "+backgroundSize+";";if(backgroundColor)background+="background-color: "+backgroundColor+";";if(transition){if(transition.effect.length>0){esTransition=transition.effect+" "+transition.delay+" "+transition.duration}}var className=settings.fullWidth&&settings.fullWidth?"jsn-es-full-width":"";html+='<div class="jsn-es-slide hidden '+className+'" es-id="'+index+'" es-transition="'+esTransition+'"  style="'+background+'">';html+='<div class="jsn-es-background" style="width: '+settings.canvasWidth+"; height: "+settings.canvasHeight+'">';if(items&&items.length>0){html+=this.renderItems(items)}html+="</div></div>";return html},renderItems:function(items){var html="";var view=this;if(items&&items.length>0){_.each(items,function(item){if(item.show){if(item.image.url.indexOf("http")<0){item.image.url=view.uriPrefix+item.image.url}var build=item.build;var customID=item.customID?'id="'+item.customID+'"':"";var customClass=item.customClassNames?" "+item.customClassNames+" ":" ";var style=item.style||{};style.zIndex=items.length-item.index;html+="<div "+customID+'class="jsn-es-item jsn-es-item-'+item.type+" "+item.type+"-item "+item.type+customClass+' hidden" '+'es-build-in="'+(build.inFade?"fade-":"")+build.inEffect+"|"+build.inStart+"|"+build.inEnd+"|"+(build.inOrigin?build.inOrigin:"")+"|"+(build.inTiming?build.inTiming:"")+'" '+'es-build-out="'+(build.outFade?"fade-":"")+build.outEffect+"|"+build.outStart+"|"+build.outEnd+"|"+(build.outOrigin?build.outOrigin:"")+"|"+(build.outTiming?build.outTiming:"")+'" '+"data-style='"+JSON.stringify(style)+"'>";if(item.link&&item.link!=""){var target=item.linkTarget?item.linkTarget:"_blank";html+='<a href="'+item.link+'" target="'+target+'">'}html+='<div class="item-container '+item.type+'">';if(item.type=="text")html+="<div>"+item.content+"</div>";if(item.type=="image")html+='<div><img src="'+item.image.url+'"></div>';if(item.type=="video"){var control="";var autoplay="";var loop="";if(item.video.controls&&item.video.controls)control=" controls ";if(item.video.autoplay&&item.video.autoplay)autoplay=" autoplay ";if(item.video.repeat&&item.video.repeat)loop=" loop ";if(item.video.type=="youtube"){var ytID=view.gup("v",item.video.url);html+='<div class="video-player '+item.video.type+'" '+control+autoplay+loop+' id="player'+view.microtime()+"-"+Math.floor(Math.random()*1e3+1)+'" width="100%" height="100%" data-id="'+ytID+'"></div>'}else if(item.video.type=="local"){var mimeType="";if(item.video.url.indexOf("mp4")!==false)mimeType="mp4";if(item.video.url.indexOf("ogg")!==false)mimeType="ogg";html+='<video width="100%" height="100%" '+control+autoplay+loop+' class="video-player '+item.video.type+'">'+'<source src="'+item.video.url+'" type="video/'+mimeType+'">'+"Your browser does not support the video tag"+"</video>"}}html+="</div>";if(typeof item.link!=="undefined"&&item.link!=""){html+="</a>"}html+="</div>"}})}return html},escapeHtml:function(text){return text.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")},gup:function(name,url){if(!url)url=location.href;name=name.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");var regexS="[\\?&]"+name+"=([^&#]*)";var regex=new RegExp(regexS);var results=regex.exec(url);return results==null?null:results[1]}});var SliderSlideView=Backbone.View.extend({events:{"videoplay .video-player":"pauseSlide"},initialize:function(opts){var self=this;opts||(opts={});this.timer=[];this.timerOut=[];var uri=window.location.pathname;this.uriPrefix=uri.substr(0,uri.indexOf("/administrator/"));this.uriPrefix=this.uriPrefix.length==1?"":this.uriPrefix;if(typeof opts.autoplayVideo!=="undefined"){this.autoplayVideo=opts.autoplayVideo}else{}this.$el.addClass("hidden")},pauseItems:function(){while(this.timer.length)clearTimeout(this.timer.pop());while(this.timerOut.length)clearTimeout(this.timerOut.pop());return this},pauseSlide:function(){while(this.timerOut.length)clearTimeout(this.timerOut.pop());return this},getTransition:function(){console.log(this.$el);var trans=this.$el.attr("es-transition").split(" ");return{name:trans[0],delay:parseInt(trans[1]),duration:parseInt(trans[2])};return this},delay:function(cb,delay,context){var timeout=setTimeout(_.bind(cb,context||this),delay);this.timer.push(timeout);return this},resetItems:function(){this.$el.find(".jsn-es-item").each(function(){$(this).attr("class",$(this).data("jsn-es-className"))});return this},stopAllVideo:function(){this.$(".video-player").JSNES_VideoItem("seekTo",0).JSNES_VideoItem("pause")},activateItems:function(transitionDuration){typeof transitionDuration=="number"||(transitionDuration=0);var $slide=this.$el;var timer=this.timer;var transition=this.getTransition();$slide.find(".jsn-es-item").each(function(){var $item=$(this);var buildIn=$item.attr("es-build-in").split("|");var buildOut=$item.attr("es-build-out").split("|");var build={"in":{effect:buildIn[0],start:parseInt(buildIn[1]),end:parseInt(buildIn[2]),origin:buildIn[3],timing:buildIn[4]},out:{effect:buildOut[0],start:parseInt(buildOut[1]),end:parseInt(buildOut[2]),origin:buildOut[3],timing:buildOut[4]}};var style=JSON.parse($item.attr("data-style"));$item.find(".item-container").css(_.omit(style,["height","width","top","left","zIndex"]));$item.css(_.pick(style,["height","width","top","left","zIndex"]));$item.data("jsn-es-className",$item.attr("class"));_(build).each(function(b,key){if(key=="in"&&b.start==b.end&&b.start==0){$item.removeClass("hidden")}if(key=="in"||key=="out"&&(b.start!=b.end||b.end<transition.delay)){timer.push(setTimeout(function(){$item.find(".item-container").css("animation","");_.delay(function(){$item.removeClass("hidden").find(".item-container").css("transform-origin",b.origin).playKeyframe({name:b.effect,duration:b.end-b.start+"ms",timingFunction:b.timing,direction:key=="in"?"normal":"reverse"})},1)},b.start+transitionDuration));timer.push(setTimeout(function(){},b.end+transitionDuration))}})});return this}});$.getScript("https://www.youtube.com/iframe_api");var checkYoutubeReadyInterval=setInterval(function(){if(typeof YT!=="undefined"&&YT.Player){$(window).trigger("youtubeready");clearInterval(checkYoutubeReadyInterval)}},1e3)}(this,JSNESjQuery);