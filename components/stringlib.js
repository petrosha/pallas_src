import showdown from 'showdown';

function convSet()
{
  let conv = new showdown.Converter();
  conv.setFlavor('github');
  conv.setOption('simpleLineBreaks',true);
  return conv;
}

function convStrip(lstr){
  return lstr.replace(/&/gm, "&amp;").replace(/>/gm, "&gt;").replace(/</gm, "&lt;").replace(/\\n/gm, "<br>");
}

function swW2H(lstr,lclass){
  let lstr1 = lstr.replace(/&/gm, "&amp;").replace(/>/gm, "&gt;").replace(/</gm, "&lt;").replace(/"/g, "&quot;").replace(/'/gm, "&apos;");
  //переводы строки
  //оборачиваем <i><s><b>
  lstr1 = lstr1.replace(/_([^_]+)_/gm,"<em>$1</em>");
  lstr1 = lstr1.replace(/~([^~]+)~/gm,"<s>$1</s>");
  lstr1 = lstr1.replace(/\*([^\*]+)\*/gm,"<strong>$1</strong>");
  lstr1 = lstr1.replace(/!\[\]\(([^\]]*)\)/gm,"<img src=\"$1\" style=\"width:50%;height:auto;\">");
  //ccылка
  lstr1 = lstr1.replace(/\[([^\]]*)\]\(([^\]]*)\)/gm,"<a href=\"$2\">$1</a>");
  if(typeof lclass==="string") lstr1 = lstr1.replace(/([^\n]*)\n/g,'<p class="'+lclass+'">$1</p>');
  else lstr1 = lstr1.replace(/([^\n]*)\n/g,'<p>$1</p>');

  return lstr1;
}
function swStrip(lstr){
  return lstr.replace(/(<([^>]+)>)/igm,"");
}
function swH2W(lstr){
  let lstr1=lstr.replace(/<strong>/gm, "*").replace(/<\/strong>/gm, "*");
  lstr1=lstr1.replace(/<em>/gm, "_").replace(/<\/em>/gm, "_");
  lstr1=lstr1.replace(/<s>/gm, "~").replace(/<\/s>/gm, "~");
  lstr1=lstr1.replace(/<p>/gm, "").replace(/<br>/gm, "").replace(/<\/p>/gm, "\n");
  lstr1=lstr1.replace(/<img src="([^"]*)"[^>]*>/gm,"![]($1)");
  lstr1=lstr1.replace(/<a href="([^"]*)"[^>]*>([^<]*)<\/a>/gm,"![$2]($1)");
  return swStrip(lstr1);
}

export {swStrip,convSet,convM2H,convStrip}
