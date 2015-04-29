/*
Wakanda Software (the "Software") and the corresponding source code remain
the exclusive property of 4D and/or its licensors and are protected by national
and/or international legislations.
This file is part of the source code of the Software provided under the relevant
Wakanda License Agreement available on http://www.wakanda.org/license whose compliance
constitutes a prerequisite to any use of this file and more generally of the
Software and the corresponding source code.
*/

var
	actions;

actions = {};

/* HTML */

function getIndent(str) {
	var nbIndent = 0;
	var i, c;
	for (i = 0; i < str.length; i++) {
		c = str.charAt(i);
		if (c == "\t") {
			++nbIndent;
		}
	}
	return nbIndent;
}

function getBaseIndent(nbIndent) {
	var i, baseIndentStr = '';
	for (i = 0; i < nbIndent; i++) {
		baseIndentStr += "\t";
	}
	return baseIndentStr;
}


function makeExtAction(pattern, options) {
	var js_action, sel, flI, flO, llI, llO, txt, nbIndent, i, baseIndentStr, inBlockStr, start, strStart;
	
	sel = studio.currentEditor.getSelectionInfo();
	
	flI = sel.firstLineIndex;
	flO = sel.firstLineOffset;
	
	llI = sel.lastLineIndex;
	llO = sel.lastLineOffset;


	studio.currentEditor.selectByVisibleLine(0, flO, flI, flI);
	txt = studio.currentEditor.getSelectedText();
	
	nbIndent = getIndent(txt);
	
	baseIndentStr = getBaseIndent(nbIndent);
	inBlockStr = baseIndentStr + "\t";
	
	pattern.replace(/{{BASEINDENT}}/g, baseIndentStr);
	pattern.replace(/{{INDENTBLOCK}}/g, inBlockStr);
	
	js_action = pattern.replace(/{{BASEINDENT}}/g, baseIndentStr).replace(/{{INDENTBLOCK}}/g, inBlockStr);
	
	studio.currentEditor.selectByVisibleLine(flO, llO, flI, llI);
	studio.currentEditor.insertText(js_action);
	
	sel = studio.currentEditor.getSelectionInfo();
	if (options && options.start) {
		strStart = options.start;
		if (typeof options.start == 'string') {
			strStart = strStart.replace(/{{BASEINDENT}}/g, nbIndent).replace(/{{INDENTBLOCK}}/g, (nbIndent + 1));
			strStart = eval(strStart);
		}
		start = sel.offsetFromStartOfText - js_action.length + strStart ;
		studio.currentEditor.selectFromStartOfText(start, (options.size || 0));
	}
}



actions.html_form = function html_form(message) {
	var
		html_form_tag;
		
	html_form_tag = "<form action=\"\" method=\"\" accept-charset=\"utf-8\">\n\
	<p><input type=\"submit\" value=\"Continue\" /></p>\n\
</form>";
	studio.currentEditor.insertText(html_form_tag);
};

actions.html_div = function html_div(message) {
	var
		html_div_tag;
	var
		selectedText;
	var
		new_str;
		
	html_div_tag = "<div>$REPLACE</div>"
	selectedText = studio.currentEditor.getSelectedText();
	new_str = html_div_tag.replace("$REPLACE", selectedText);
	studio.currentEditor.insertText(new_str);
	if (selectedText === '') {
		var sel = studio.currentEditor.getSelectionInfo();
		studio.currentEditor.setCaretPosition(sel.offsetFromStartOfText - 6);
	}
};

function li(type) {
	var
		html_olli_tag;
	var
		selectedText;
	var
		strArray;
	var
		typeTag;

	typeTag = type==='ol'?"<ol>\r":"<ul>\r";
	html_olli_tag = typeTag;
	selectedText = studio.currentEditor.getSelectedText();
	if (selectedText === "") {
		html_olli_tag += "<li></li>\r";
	}
	else {
		strArray = selectedText.split('\r');
		
		for (var i = 0; i < strArray.length; i++)
		{
			if (strArray[i] != "")
				html_olli_tag += "  <li>" + strArray[i] + "</li>\r";
		}
	}
	html_olli_tag += typeTag;
	studio.currentEditor.insertText(html_olli_tag);
}

actions.html_ol = function html_ol(message) {
	li('ol');
}

actions.html_ul = function html_ul(message) {
	li('ul');
}

actions.html_br = function html_br(message) {
	studio.currentEditor.insertText("<br/>");
};

actions.html_p = function html_p(message) {
	var
		html_p_tag;
	var
		selectedText;
	var
		new_str;
		
	html_p_tag = "<p>$REPLACE</p>";
	selectedText = studio.currentEditor.getSelectedText();
	new_str = html_p_tag.replace("$REPLACE", selectedText);
	studio.currentEditor.insertText(new_str);

	if (selectedText === '') {
		var sel = studio.currentEditor.getSelectionInfo();
		studio.currentEditor.setCaretPosition(sel.offsetFromStartOfText - 4);
	}
};

/*Javascript*/

actions.js_func = function js_func(message) {
	var pattern = "function func () {\n{{INDENTBLOCK}}\n{{BASEINDENT}}};";
	
	makeExtAction(pattern, {
		start : 9,
		size : 4
	});
};

actions.js_if = function js_if(message) {
	var pattern = "if () {\n{{INDENTBLOCK}}\n{{BASEINDENT}}} else {\n{{INDENTBLOCK}}\n{{BASEINDENT}}}";
	
	makeExtAction(pattern, {
		start : 4
	});
};

actions.js_for = function js_for(message) {
	var pattern = "for (var i = 0; i < x; i++) {\n{{INDENTBLOCK}}\n{{BASEINDENT}}};\n";
	
	makeExtAction(pattern, {
		start : '30 + {{INDENTBLOCK}}'
	});
};

actions.js_switch = function js_switch(message) {
	var pattern = "switch() {\n{{INDENTBLOCK}}case x:\n{{INDENTBLOCK}}\tbreak;\n{{INDENTBLOCK}}case x:\n{{INDENTBLOCK}}\tbreak;\n{{BASEINDENT}}}";
	
	makeExtAction(pattern, {
		start : 7
	});
};

actions.js_try = function js_try(message) {
	var pattern = "try {\n{{INDENTBLOCK}}\n{{BASEINDENT}}} catch (e) {\n{{INDENTBLOCK}}\n{{BASEINDENT}}}";
	
	makeExtAction(pattern, {
		start : '6 + {{INDENTBLOCK}}'
	});
};



function comment(type) {
	var
		comment_snippet;
	var
		selectedText;
	var
		new_str;
		
	comment_snippet = type==='html'?"<!--$REPLACE-->":"/*$REPLACE*/";
	selectedText = studio.currentEditor.getSelectedText();
	new_str = comment_snippet.replace("$REPLACE", selectedText);
	studio.currentEditor.insertText(new_str);
};


actions.html_comment = function html_comment(message) {
	comment('html');
}

actions.js_comment = function js_comment(message) {
	comment('js');
}



//point d'entree unique de l'extension 
exports.handleMessage = function handleMessage(message) {

	var
		actionName;
	
	actionName = message.action;
	
	if (!actions.hasOwnProperty(actionName)) {
		studio.alert("I don't know about this message: " + actionName);
		return false;
	}
	
	//if (message.event === "fromSender") {
		actions[actionName](message);
	//}
}

