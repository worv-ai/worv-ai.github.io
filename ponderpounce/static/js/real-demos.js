(function () {
    const gallery = document.getElementById('real-demos');
    if (!gallery) return;
    const tasks = [
        { id: 'putfruits', title: 'PutFruits', family: 'Counting', examples: [
            { id: 'putfruits', demoFrames: 0, outcomes: ['Failure', 'Failure', 'Success'],
                instruction: 'Put 2 fruits from the basket into the bin and press the button to stop.',
                note: 'Extra fruit is added to the bin during execution. The robot must remember its own transfers.' },
            { id: 'putfruits-2', demoFrames: 0, outcomes: ['Failure', 'Success', 'Success'],
                instruction: 'Put 4 fruits from the basket into the bin and press the button to stop.',
                note: 'An extra fruit is added to the bin during execution.' },
            { id: 'putfruits-ep01', demoFrames: 0, outcomes: ['Success', 'Success', 'Success'],
                instruction: 'Put 1 fruit from the basket into the bin and press the button to stop.' }
        ] },
        { id: 'trackcube', title: 'TrackCube', family: 'Permanence', examples: [
            { id: 'trackcube-2', demoFrames: 566, outcomes: ['Failure', 'Failure', 'Success'],
                instruction: 'Watch the video carefully, then pick up the cup that hides the green cube.' },
            { id: 'trackcube-ep09', demoFrames: 576, outcomes: ['Failure', 'Failure', 'Success'],
                instruction: 'Watch the video carefully, then pick up the cup that hides the green cube.' },
            { id: 'trackcube-3', demoFrames: 310, outcomes: ['Failure', 'Success', 'Success'],
                instruction: 'Watch the video carefully, then pick up the cup that hides the green cube.' }
        ] },
        { id: 'repickblock', title: 'RepickBlock', family: 'Reference',
            instruction: 'Watch the video carefully, then pick up all the blocks that have been picked up before in the same order.',
            examples: [
                { id: 'repickblock', demoFrames: 169, outcomes: ['Failure', 'Failure', 'Success'] },
                { id: 'repickblock-2', demoFrames: 318, outcomes: ['Failure', 'Failure', 'Success'] },
                { id: 'repickblock-3', demoFrames: 214, outcomes: ['Failure', 'Success', 'Success'] }
            ] },
        { id: 'drawpattern', title: 'DrawPattern', family: 'Imitation',
            instruction: 'Watch the video carefully, then replicate the same path.',
            examples: [
                { id: 'drawpattern', demoFrames: 226, outcomes: ['Failure', 'Success', 'Success'] },
                { id: 'drawpattern-2', demoFrames: 318, outcomes: ['Failure', 'Failure', 'Success'] },
                { id: 'drawpattern-3', demoFrames: 166, outcomes: ['Failure', 'Success', 'Success'] }
            ] }
    ];
    const models = [
        { id: 'pi05', title: 'π₀.₅' },
        { id: 'framesamp', title: 'FrameSamp+Modul' },
        { id: 'ponderpounce', title: 'PonderPounce' }
    ];
    const tabs = gallery.querySelector('[role="tablist"]');
    const panels = gallery.querySelector('.demo-panels');
    const status = gallery.querySelector('.demo-status');
    let playRequest = 0;

    function attachSubgoals(example, section) {
        const video = section.querySelector('.demo-ours video');
        const output = section.querySelector('.demo-subgoal p');
        let cues = null;
        let failed = false;
        function update() {
            const time = video.currentTime - example.demoFrames / 30;
            let text = 'Waiting for the first subgoal…';
            if (time < 0) text = 'Watching the task demonstration…';
            else if (failed) text = 'Subgoal log could not be loaded.';
            else if (!cues) text = 'Loading subgoal log…';
            else for (const cue of cues) {
                if (cue.step / 30 > time + 0.0001) break;
                text = cue.subgoal;
            }
            if (output.textContent !== text) output.textContent = text;
        }
        ['timeupdate', 'seeking', 'seeked', 'loadedmetadata', 'ended', 'emptied'].forEach(function (event) {
            video.addEventListener(event, update);
        });
        fetch('./static/videos/real/subgoals/' + example.id + '.jsonl')
            .then(function (response) {
                if (!response.ok) throw new Error('Subgoal log unavailable');
                return response.text();
            })
            .then(function (text) {
                cues = text.trim().split(/\r?\n/).filter(Boolean).map(function (line) { return JSON.parse(line); })
                    .filter(function (cue) {
                        return cue.src === 'S2' && Number.isFinite(cue.step) && cue.step >= 0 &&
                            typeof cue.subgoal === 'string' && cue.subgoal.trim();
                    }).sort(function (a, b) { return a.step - b.step; });
                if (!cues.length) throw new Error('No generated subgoals');
                update();
            }).catch(function () { failed = true; update(); });
        update();
    }

    tasks.forEach(function (task, index) {
        const tab = document.createElement('button');
        tab.type = 'button';
        tab.id = 'demo-tab-' + task.id;
        tab.className = 'demo-tab';
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-controls', 'demo-panel-' + task.id);
        tab.setAttribute('aria-selected', String(index === 0));
        tab.tabIndex = index === 0 ? 0 : -1;
        tab.innerHTML = '<span>' + task.title + '</span><small>' + task.family + ' · 3 examples</small>';
        tabs.appendChild(tab);
        const panel = document.createElement('div');
        panel.id = 'demo-panel-' + task.id;
        panel.className = 'demo-panel';
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('aria-labelledby', tab.id);
        panel.hidden = index !== 0;
        task.examples.forEach(function (example, exampleIndex) {
            const section = document.createElement('section');
            section.className = 'demo-example';
            section.hidden = exampleIndex !== 0;
            section.setAttribute('aria-label', task.title + ' example ' + (exampleIndex + 1));
            section.innerHTML = '<div class="demo-input"><span>Input instruction</span><p class="demo-instruction">' +
                (example.instruction || task.instruction) + '</p></div>' +
                (example.note ? '<p class="demo-note">' + example.note + '</p>' : '') +
                '<div class="demo-grid">' + models.map(function (model, modelIndex) {
                    const base = './static/videos/real/' + example.id + '-' + model.id;
                    const success = example.outcomes[modelIndex] === 'Success';
                    return '<figure class="demo-card' + (modelIndex === 2 ? ' demo-ours' : '') + '">' +
                        '<figcaption><strong>' + model.title + '</strong><span class="demo-result ' +
                        (success ? 'demo-success' : 'demo-failure') + '">' + example.outcomes[modelIndex] + '</span></figcaption>' +
                        (modelIndex === 2 ? '<div class="demo-subgoal"><span>Ponder output · subgoal</span><p>Loading subgoal log…</p></div>' : '') +
                        '<video controls muted playsinline preload="none" poster="' + base + '.jpg" aria-label="' +
                        task.title + ' example ' + (exampleIndex + 1) + ': ' + model.title + ', ' + example.outcomes[modelIndex].toLowerCase() + '">' +
                        '<source src="' + base + '.mp4" type="video/mp4">' +
                        '<a href="' + base + '.mp4">Download video</a></video></figure>';
                }).join('') + '</div>';
            panel.appendChild(section);
            attachSubgoals(example, section);
        });
        panels.appendChild(panel);
    });
    const buttons = Array.from(tabs.querySelectorAll('[role="tab"]'));
    const allVideos = Array.from(gallery.querySelectorAll('video'));
    function pauseAll() {
        playRequest += 1;
        allVideos.forEach(function (video) { video.pause(); });
    }
    async function playComparison(videos) {
        pauseAll();
        const request = playRequest;
        status.textContent = '';
        const results = await Promise.allSettled(videos.map(function (video) {
            video.currentTime = 0;
            return video.play();
        }));
        if (request === playRequest && results.some(function (result) { return result.status === 'rejected'; })) {
            status.textContent = 'Use the individual video controls if your browser blocks group playback.';
        }
    }
    function playSelectedExample() {
        playComparison(Array.from(panels.querySelectorAll('.demo-panel:not([hidden]) .demo-example:not([hidden]) video')));
    }
    function updateExampleButtons(index) {
        gallery.querySelectorAll('[data-demo-example]').forEach(function (button) {
            button.setAttribute('aria-pressed', String(Number(button.dataset.demoExample) === index));
        });
    }
    function select(index) {
        pauseAll();
        buttons.forEach(function (button, i) {
            button.setAttribute('aria-selected', String(i === index));
            button.tabIndex = i === index ? 0 : -1;
            document.getElementById(button.getAttribute('aria-controls')).hidden = i !== index;
        });
        const activePanel = panels.querySelector('.demo-panel:not([hidden])');
        updateExampleButtons(Array.from(activePanel.querySelectorAll('.demo-example')).findIndex(function (section) { return !section.hidden; }));
        status.textContent = '';
        playSelectedExample();
    }
    buttons.forEach(function (button, index) {
        button.addEventListener('click', function () { select(index); });
        button.addEventListener('keydown', function (event) {
            let next;
            if (event.key === 'ArrowRight') next = (index + 1) % buttons.length;
            if (event.key === 'ArrowLeft') next = (index + buttons.length - 1) % buttons.length;
            if (event.key === 'Home') next = 0;
            if (event.key === 'End') next = buttons.length - 1;
            if (next === undefined) return;
            event.preventDefault();
            select(next);
            buttons[next].focus();
        });
    });
    gallery.querySelectorAll('[data-demo-example]').forEach(function (button) {
        button.addEventListener('click', function () {
            pauseAll();
            const index = Number(button.dataset.demoExample);
            panels.querySelector('.demo-panel:not([hidden])').querySelectorAll('.demo-example').forEach(function (section, i) {
                section.hidden = i !== index;
            });
            updateExampleButtons(index);
            status.textContent = '';
            playSelectedExample();
        });
    });
    gallery.querySelector('[data-example-play]').addEventListener('click', playSelectedExample);
    gallery.querySelector('[data-demo-pause]').addEventListener('click', pauseAll);
    gallery.querySelector('[data-demo-speed]').addEventListener('change', function (event) {
        allVideos.forEach(function (video) { video.playbackRate = Number(event.target.value); });
    });
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) pauseAll();
    });
    if (!document.hidden) playSelectedExample();
}());
