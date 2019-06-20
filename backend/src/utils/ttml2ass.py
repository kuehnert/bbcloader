#!/usr/bin/env python3
# from: https://gist.github.com/sfan5/2f94fefbc326052b185ec995248a9ffc
import sys
from xml.dom.minidom import parseString

COLORS = { # TODO more colors
	"white"  : "FFFFFF",
	"black"  : "000000",
	"yellow" : "FFFF00",
	"green"  : "00FF00",
	"cyan"   : "00FFFF",
}

def compat_read(filename):
	f = open(filename, "rb")
	tmp = f.read(2)
	# detect UTF-16 via BOM
	if tmp == b"\xff\xfe":
		enc = "UTF-16LE"
	elif tmp == b"\xfe\xff":
		enc = "UTF-16BE"
	else:
		f.seek(0, 0)
		enc = "utf8"
	tmp = f.read().decode(enc)
	f.close()
	return tmp

def iterate_childelems(x):
	for xn in x.childNodes:
		if xn.nodeType == 3:
			continue
		yield xn

def convert_ts(s):
	vals = tuple(int(e) for e in s.split(":"))
	return "%d:%02d:%02d.%02d" % vals


if len(sys.argv) < 2 or sys.argv[1] in ("-h", "--help"):
	print("Usage: %s <input file> [output file]" % sys.argv[0], file=sys.stderr)
	print("Converts TTML subtitles into ASS format", file=sys.stderr)
	exit(1)

if len(sys.argv) > 2:
	of = open(sys.argv[2], "w")
else:
	of = sys.stdout


of.write("""[Script Info]
Title:
ScriptType: v4.00+
WrapStyle: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
""")

x = parseString(compat_read(sys.argv[1]))
assert x.childNodes[0].tagName == "tt"
tmp = list(iterate_childelems(x.childNodes[0]))
assert len(tmp) == 2
xhead, xbody = tmp[0], tmp[1]

# read style information
for xn in iterate_childelems(xhead):
	if xn.tagName != "styling":
		continue
	assert len(xn.childNodes) == 1, "Only one style supported"
	xn = xn.childNodes[0]

	fmt = "Style: Default,%s,%d,&H00%s,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,2,2,%d,10,10,10,1\n"
	color = COLORS[xn.getAttribute("tts:color")]
	alignment = ({"left": 1, "center": 2, "right": 3})[xn.getAttribute("tts:textAlign")]
	font = xn.getAttribute("tts:fontFamily")
	fontsz = int(xn.getAttribute("tts:fontSize"))
	of.write(fmt % (font, fontsz, color, alignment))

of.write("""
[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
""")

for xn in iterate_childelems(xbody):
	assert xn.tagName == "div"
	for xn in iterate_childelems(xn):
		assert xn.tagName == "p"
		ts_start = convert_ts(xn.getAttribute("begin"))
		ts_end = convert_ts(xn.getAttribute("end"))
		of.write("Dialogue: 0,%s,%s,Default,,0,0,0,," % (ts_start, ts_end))
		for xtext in xn.childNodes:
			if xtext.nodeType == 3: # raw text
				of.write(xtext.wholeText)
				continue
			assert xtext.nodeType == 1 # special or stylized element
			if xtext.tagName == "br":
				of.write("\\n")
				continue
			assert xtext.tagName == "span"
			color = COLORS[xtext.getAttribute("tts:color")]
			of.write("{\\c&H%s&}%s{\\r}" % (color, xtext.firstChild.wholeText))
		of.write("\n")
