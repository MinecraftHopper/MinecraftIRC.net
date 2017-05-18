"use strict";

import $ from "jquery";
import jQuery from "jquery";

import "what-input";
import 'foundation-sites';

import riot from "riot";
import questions from "./questions.tag";
import question from "./question.tag";
import raw from "./raw.tag";


(function(window, $) {
    $(() => {
        $(document).foundation();
        riot.mount('questions');
    });
}(window, $));