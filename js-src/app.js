"use strict";

global.$ = global.jQuery = require('jquery');
require('what-input');
require('foundation-sites');

import riot from "riot";
import questions from "./questions.tag";
import question from "./question.tag";
import raw from "./raw.tag";

class MinecraftIRC {
    init() {
        riot.mount(questions);
    }
}

var mcirc = new MinecraftIRC();

$(function () {
    mcirc.init();
    $(document).foundation();
});