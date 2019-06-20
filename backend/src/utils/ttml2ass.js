const formatLine = (line) => {
  const begin = line.match(/begin="([^"]+)"/)[1];
  const end = line.match(/end="([^"]+)"/)[1];
  const styleRes = line.match(/style="([^"]+)"/);
  const style = styleRes ? styleRes[1] : 'Default';
  const text = line
    .match(/>(.+)<\/p/)[1]
    .replace(/<br \/>/g, '\\N')
    .replace(/<span tts:color="white">/g, '{\\c&Hffffff&}')
    .replace(/<span tts:color="yellow">/g, '{\\c&H00ffff&}')
    .replace(/<span tts:color="cyan">/g, '{\\c&Hffff00&}')
    .replace(/<span tts:color="lime">/g, '{\\c&H00ff00&}')
    .replace(/<\/span>/g, '{\\c}');
  const ass = `Dialogue: 0,${begin},${end},${style},,0,0,0,,${text}\n`;
  return ass;
};

const ttml2ass = (ttml, title) => {
  const preamble = `[Script Info]
; This is an Advanced Sub Station Alpha v4+ script.
Title: ${title}
ScriptType: v4.00+
Collisions: Normal
PlayDepth: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Arial,20,&H00FFFFFF,&H0300FFFF,&H00000000,&H02000000,0,0,0,0,100,100,0,0,1,2,1,2,10,10,10,1
Style: s2,Arial,20,&H00FFFF00,&H0300FFFF,&H00000000,&H02000000,0,0,0,0,100,100,0,0,1,2,2,2,10,10,10,1
Style: s1,Arial,20,&H0000FFFF,&H0300FFFF,&H00000000,&H02000000,0,0,0,0,100,100,0,0,1,2,2,2,10,10,10,1
Style: s3,Arial,20,&H0000FF00,&H0300FFFF,&H00000000,&H02000000,0,0,0,0,100,100,0,0,1,2,2,2,10,10,10,1
Style: s0,sansSerif,16,&H00FFFFFF,&H0300FFFF,&H00000000,&H02000000,0,0,0,0,100,100,0,0,1,2,2,2,10,10,10,1


[Events]
Format: Layer, Start, End, Style, Actor, MarginL, MarginR, MarginV, Effect, Text
`;

  let out = "" + preamble;
  lines = ttml.match(/<p .+<\/p>/g);

  console.log(`${lines.length} lines found.`);

  lines.forEach((line) => {
    out += formatLine(line);
  });

  return out;
};

module.exports = ttml2ass;
