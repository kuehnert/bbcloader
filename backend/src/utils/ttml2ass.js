#!/usr/bin/env node
// VERSION 2.0.0
const parser = require('fast-xml-parser');

const HEADER = `[Script Info]
; This is an Advanced Sub Station Alpha v4+ script.
Title: {{TITLE}}
ScriptType: v4.00+
Collisions: Normal
PlayDepth: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Arial,20,&H00FFFFFF,&H0300FFFF,&H00000000,&H02000000,0,0,0,0,100,100,0,0,1,2,1,2,10,10,10,1\n`;

const EVENT_HEADER = `\n\n[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n`;

const COLORS = { YELLOW: "&H0000FFFF", CYAN: "&H00FFFF00", LIME: "&H00FFDD00", WHITE: "&H00FFFFFF", BLACK: "&H02000000" };

const STYLE_DICT = {};

const clean = (text) => {
  const LEGACY_MAPPINGS = [
    [/<span tts:color="white">/gi, '{\\c&HFFFFFF&}'],
    [/<span tts:color="yellow">/gi, '{\\c&H00FFFF&}'],
    [/<span tts:color="cyan">/gi, '{\\c&HFFFF00&}'],
    [/<span tts:color="lime">/gi, '{\\c&HFFDD00&}'],
    [/<\/span>/gi, '{\\c}'],
  ];

  const MAPPINGS = [
    [/<br \/><\/p>/gi, '</p>'],
    [/<br \/>/gi, '\\N'],
    [/&quot;/gi, '\"']
  ];

  const legacy = !text.match("urn:ebu:tt:distribution:2018-04");
  if (legacy) {
    console.log('Applying legacy settings');
    LEGACY_MAPPINGS.forEach(([entity, char]) => {
      text = text.replace(entity, char);
    });
  }

  MAPPINGS.forEach(([entity, char]) => {
    text = text.replace(entity, char);
  });

  return text;
};

const convertTimestamp = timeStr => {
  if (timeStr.length === 8) {
    return timeStr + ".00";
  } else if (timeStr.length === 12) {
    return timeStr.substring(0, 11);
  } else {
    return timeStr;
  }
};

const convertColor = colorStr => {
  if (colorStr.match(/#[a-f\d]{8}/)) {
    // TTML: Red-Green-Blue-Alpha
    // <style tts:backgroundColor="#000000ff" tts:color="#ffff00ff" xml:id="S5" />
    // ASS:  Alpha-Blue-Green-Red
    // Style: S5,Arial,20,&HFFFF00FF,&H0300FFFF,&H00000000,&HFF000000,0,0,0,0,100,100,0,0,1,2,1,2,10,10,10,1
    const match = colorStr.toUpperCase().match(/#(?<red>.{2})(?<green>.{2})(?<blue>.{2})(?<opacity>.{2})/);
    const { opacity, red, green, blue } = match.groups;
    let alpha = (255 - parseInt(opacity, 16)).toString(16);
    if (alpha.length < 2) {
      alpha = "0" + alpha;
    }

    return `&H${alpha}${blue}${green}${red}`;
  } else {
    const upColor = colorStr.toUpperCase();
    return COLORS[upColor] || upColor;
  }
};

const formatStyle = (style) => {
  // if (style['@_xml:id'].length > 5) {
  //   return "";
  // }

  const primColor = (style['@_tts:color']) ? convertColor(style['@_tts:color']) : '&H00FFFFFF';
  const backColor = (style['@_tts:backgroundColor']) ? convertColor(style['@_tts:backgroundColor']) : '&H02000000';
  STYLE_DICT[style['@_xml:id']] = primColor;

  return `Style: ${style['@_xml:id'] || style['@_id']},Arial,20,${primColor},&H0300FFFF,&H00000000,${backColor},0,0,0,0,100,100,0,0,1,2,1,2,10,10,10,1\n`;
};

const formatStyles = (styles, title) => {
  let out = HEADER.replace("{{TITLE}}", title);

  console.log('styles', JSON.stringify(styles, null, 4));
  if (Array.isArray(styles)) {
    styles.forEach(style => {
      out += formatStyle(style);
    });
  } else {
    out += formatStyle(styles);
  }

  return out;
};

const formatLine = (line) => {
  if (!line['@_begin']) {
    // if there is no timecode in the line, copy it from first nested span
    if (line['span'] && line['span'][0] && line['span'][0]['@_begin']) {
      line['@_begin'] = line['span'][0]['@_begin'];
      line['@_end'] = line['span'][0]['@_end'];
    } else {
      // error, no timecode in nested span, skip line
      return "";
    }
  }

  const begin = convertTimestamp(line['@_begin']);
  const end = convertTimestamp(line['@_end']);

  let text;
  let style = line['@_style'] || 'Default';

  if (Array.isArray(line.span)) {
    // Multiple span tags
    style = line.span[0]['@_style'] || 'Default';
    // Check if colour in all spans is the same
    const allSame = line.span.every(s => s['@_style'] === style);
    if (allSame) {
      // no need for extra colouring
      text = line.span.map(sp => sp['#text']).join('\\N');
    } else {
      // each bit with colour tags
      text = line.span.map(sp => `{\\c${STYLE_DICT[sp['@_style']]}&}${sp['#text']}{\\c}`).join('\\N');
    }
  } else if (line.span) {
    style = line.span['@_style'] || 'Default';
    text = line.span["#text"];
  } else {
    text = line["#text"];
  }
  const ass = `Dialogue: 0,${begin},${end},${style},,0,0,0,,${text}\n`;
  // console.log('line', line);
  // console.log('ass', ass);
  return ass;
};

const ttml2ass = (ttml, title) => {
  const cleanedTTML = clean(ttml);
  const json = parser.parse(cleanedTTML, { ignoreAttributes: false });
  const lines = json.tt.body.div.p;
  const styles = json.tt.head.styling.style;
  let out = formatStyles(styles, title) + EVENT_HEADER;

  lines.forEach((line) => {
    out += formatLine(line);
  });

  return out;
};

module.exports = ttml2ass;
