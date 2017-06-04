<questions>
    <question question="{ currentQuestion }"></question>
    <div class="is-mobile is-hidden">
        <h1 class="heading">Welcome to #minecrafthelp!</h1>
        <p class="description">We have detected that you are currently on a mobile device.</p>
        <p class="description"><strong>We do not offer support over mobile devices</strong> as we will often require you to run diagnostic tools on the computer in question and pass on messages; this is much more efficient when you are on the computer in question.</p>
        <p class="description"><strong>Please visit this site on the computer that is having problems with Minecraft.</strong></p>
        <p class="description"></p>
        <p class="description tiny-text">(If you think you're seeing this in error, please try another browser)</p>
    </div>

    <script>
        import {isMobile} from './util.js';
        import question from "./question.tag";

        this.log = [];
        this.currentQuestion = {};
        let self = this;

        displayQuestion(name, track = true) {
            if (track) {
                ga('send', 'event', 'mch-landing', 'display-question', name);
            }
            this.currentQuestion = this.questions[name];
            this.update();
            this.tags.question.doUpdate();
        }

        displayNext(_, to) {
            if (typeof to === 'undefined') {
                to = $("input.choice:checked", this.root).attr("value");
            }
            this.log.push(to);
            this.displayQuestion(to);
        }

        displayPrev() {
            this.log.pop();
            this.displayQuestion(this.log[this.log.length - 1]);
        }

        displayStartOver() {
            this.log = [];
            ga('send', 'event', 'mch-landing', 'start-over');
            this.displayQuestion(self.config.startQuestion, false);
        }

        displayEnd(exitTo) {
            ga('send', 'event', 'mch-landing', 'exit', exitTo.replace(".", "").replace("-chat", ""));
            $("question", this.root).addClass("is-hidden");
            $(exitTo).removeClass("is-hidden");
        }

        this.on('mount', () => {
            if (isMobile()) {
                ga('send', 'event', 'mch-landing', 'end-mobile-detection');
                $("question", self.root).addClass("is-hidden");
                $(".is-mobile", self.root).removeClass("is-hidden");
            } else {
                $.getJSON(opts.source, function (obj) {
                    self.config = obj;
                    self.questions = self.config.questions;

                    self.log.push(self.config.startQuestion);
                    $(".buttons-list", self.root).removeClass("is-hidden");
                    ga('send', 'event', 'mch-landing', 'enter');
                    self.displayQuestion(self.config.startQuestion, false);
                });
            }
        })
    </script>
</questions>