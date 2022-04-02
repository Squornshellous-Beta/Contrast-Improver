module.exports={
	title:"Contrast Improver",
	summary:"Adds backgrounds to low-contrast text.",
	author:"Squornshellous Beta",
	modVersion:1.0,
	
	edit(archive) {
		// this might be really inefficient, but it only runs once each reload
		for (let i = 0; i < 15000; i++) {
			const pageString = `00${i}`;

			// if the page exists (prevents certain errors)
			if (archive.mspa.story[pageString]) {
				if (archive.mspa.story[pageString].content.search(/LOG\|/)!=-1) archive.mspa.story[pageString].content=archive.mspa.story[pageString].content.replace(/LOG\|/,"LOG|<br /><p id=\"contrastScriptBroke\">If this text remains visible, the contrast script has stopped running! Try CTRL-R.</p>");
				else if (archive.mspa.story[pageString].content.search(/BIZ\|/)!=-1) archive.mspa.story[pageString].content=archive.mspa.story[pageString].content.replace(/BIZ\|/,"BIZ|<br /><p id=\"contrastScriptBroke\">If this text remains visible, the contrast script has stopped running! Try CTRL-R.</p>");
				else archive.mspa.story[pageString].content="<p id=\"contrastScriptBroke\">If this text remains visible, the contrast script has stopped running! Try CTRL-R.</p>"+archive.mspa.story[pageString].content;
			}
		}
	},
	
	styles:[
		{
			source: "./style.css"
		}
	],
	
	vueHooks:[{
		matchName: "TabFrame",
		created() {
			window.contrastLoop=setInterval(function() {
				var broke=document.querySelector("#contrastScriptBroke");
				if (broke) {
					while (broke) {
						broke.remove();
						broke=document.querySelector("#contrastScriptBroke, .logContent>br:first-child");
					}
					var textContent=document.querySelector(".textContent");
					var eles=document.querySelectorAll(".textContent p, .textContent span");
					
					for (var i=0;i<eles.length;i++) {
						var bgElement=eles[i];
						if (bgElement.querySelectorAll("span").length==0) {
							while(getComputedStyle(bgElement).getPropertyValue("background-color")=="rgba(0, 0, 0, 0)") bgElement=bgElement.parentNode;
							var bgColor=parseColor(getComputedStyle(bgElement).getPropertyValue("background-color"));
							var textColor=parseColor(getComputedStyle(eles[i]).getPropertyValue("color"));

							var contrast=1.5;
							var shadowColor="";
							var backgroundColor="";
							
							if (isWhite(textColor)) {
								var shadow=[];
								for (var z=-1;z<2;z++) for (var y=-1;y<2;y++) shadow[shadow.length]=z+"px "+y+"px 1px #0e4603";
								eles[i].style.textShadow=shadow.join(", ");
							}
							else {
								var whiteContrast=contrastRatio(bgColor,[255,255,255]);
								var blackContrast=contrastRatio(bgColor,[0,0,0]);
								
								if (whiteContrast>blackContrast) {
									var backgroundColor="#fff";
									contrast=2;
								}
								else var backgroundColor="#535353";
								
								if (contrastRatio(bgColor,textColor)<contrast) {
									if (backgroundColor!="") {
										eles[i].style.background=backgroundColor;
										eles[i].style.boxShadow="-3px 0 0 0 "+backgroundColor+", 3px 0 0 0 "+backgroundColor;
									}
								}
							}
						}
					}
					
					function iterateShadow(color) {
					}
					function isWhite(color) {
						for (var i=0;i<color.length;i++) if (color[i]!=255) return false;
						return true;
					}
					function parseColor(color) {
						var colors={"aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff","beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887","cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff","darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f","darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkturquoise":"#00ced1","darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dodgerblue":"#1e90ff","firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff","gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","green":"#008000","greenyellow":"#adff2f","honeydew":"#f0fff0","hotpink":"#ff69b4","indianred ":"#cd5c5c","indigo":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c","lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2","lightgrey":"#d3d3d3","lightgreen":"#90ee90","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightsteelblue":"#b0c4de","lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6","magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370d8","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee","mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5","navajowhite":"#ffdead","navy":"#000080","oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6","palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#d87093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080","rebeccapurple":"#663399","red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1","saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4","tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0","violet":"#ee82ee","wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5","yellow":"#ffff00","yellowgreen":"#9acd32"};
						if (colors[color]) var rgbColor=colors[color];
						else var rgbColor=color;
						return decimate(rgbColor);
					}
					function decimate(hex) {
						if (hex.search("#")!=-1) {
							if (hex.length==4) {
								var r=hex.substr(1,1);
								var g=hex.substr(2,1);
								var b=hex.substr(3,1);
								hex="#"+r+r+g+g+b+b;
							}
							var r=parseInt(hex.substr(1,2),16);
							var g=parseInt(hex.substr(3,2),16);
							var b=parseInt(hex.substr(5,2),16);
							return [r,g,b];
						}
						else {
							return (hex.replace(/.*\(|\).*/g,"").split(/[^0-9]+/));
						}
					}
					function relativeLuminance(col) {
						//Convert hex to 0-1 scale
						var components={
							"r":col[0]/255,
							"g":col[1]/255,
							"b":col[2]/255
						}
						//Correct for sRGB
						var cols=["r","g","b"];
						for (var i=0;i<3;i++) {
							if (components[cols[i]]<=0.04045) {
								components[cols[i]]=components[cols[i]]/12.92;
							}
							else {
								components[cols[i]]=Math.pow(((components[cols[i]]+0.055)/1.055),2.4);
							}
						}
						//Calculate relative luminance using ITU-R BT. 709 coefficients
						return (components.r*0.2126)+(components.g*0.7152)+(components.b*0.0722);
					}

					/**
					 * Calculate contrast ratio acording to WCAG 2.0 formula
					 * Will return a value between 1 (no contrast) and 21 (max contrast)
					 * @link http://www.w3.org/TR/WCAG20/#contrast-ratiodef
					 */
					function contrastRatio(c1, c2) {
						var y1=relativeLuminance(c1);
						var y2=relativeLuminance(c2);
						//Arrange so $y1 is lightest
						if (y1<y2) {
							var y3=y1;
							y1=y2;
							y2=y3;
						}
						return (y1+0.05)/(y2+0.05);
					}
				}
			},100);
		}
	}]
};