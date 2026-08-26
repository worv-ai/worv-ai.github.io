// Single source of truth for project listings across the site.
// To add or update a project, edit only this file — every page that consumes it
// (main page navbar, child-page "More Research" dropdown) picks it up automatically.
//
// Schema:
//   external:    true for absolute URLs; false (or omitted) for site-internal paths
//   path:        site-root-relative path (e.g. "canvas/") — required when external is false
//   url:         absolute URL — required when external is true
//   shortTitle:  short name used in compact navigation (main page navbar)
//   title:       full paper title used in expanded dropdowns (child-page "More Research")
//   venue:       venue label shown as a tag in 'full' mode
//   venueClass:  Bulma color class — use "is-success" for main-conference papers and
//                "is-link" for workshop papers (matches the landing-page card convention)

const RESEARCH_PROJECTS = [
    {
        external: false,
        path: 'ponderpounce/',
        shortTitle: 'PonderPounce',
        title: 'PonderPounce: A Pretrained MLLM as an Episode Context Engine for Robot Control',
        venue: 'Under Review',
        venueClass: 'is-warning'
    },
    {
        external: true,
        url: 'https://github.com/allenai/vla-evaluation-harness',
        shortTitle: 'VLA Evaluation Harness',
        title: 'vla-eval: A Unified Evaluation Harness for Vision-Language-Action Models',
        venue: 'From Data to Decisions Workshop @ ICRA 2026',
        venueClass: 'is-link'
    },
    {
        external: true,
        url: 'https://cvlab-kaist.github.io/WorldCam/',
        shortTitle: 'WorldCam',
        title: 'WorldCam: Interactive Autoregressive 3D Gaming Worlds with Camera Pose as a Unifying Geometric Representation',
        venue: 'VideoWorldModel Workshop @ CVPR 2026',
        venueClass: 'is-link'
    },
    {
        external: false,
        path: 'costnav/',
        shortTitle: 'CostNav',
        title: 'CostNav: A Navigation Benchmark for Real-World Economic-Cost Evaluation of Physical AI Agents',
        venue: 'ScaleBot Workshop @ CVPR 2026',
        venueClass: 'is-link'
    },
    {
        external: false,
        path: 'd2e/',
        shortTitle: 'D2E',
        title: 'D2E: Scaling Vision-Action Pretraining on Desktop Data for Transfer to Embodied AI',
        venue: 'ICLR 2026',
        venueClass: 'is-success'
    },
    {
        external: false,
        path: 'canvas/',
        shortTitle: 'SketchDrive (CANVAS)',
        title: 'CANVAS: Commonsense-Aware Navigation System for Intuitive Human-Robot Interaction',
        venue: 'ICRA 2025',
        venueClass: 'is-success'
    }
];

// Render the project list into a container.
//   options.prefix:  string prepended to internal paths (default "../" for child pages;
//                    use "./" for the site root index)
//   options.mode:    "full" (default) shows full title + venue tag; "short" shows shortTitle only
function renderResearchDropdown(containerId, options) {
    const container = document.getElementById(containerId);
    if (!container) return;

    options = options || {};
    const prefix = options.prefix !== undefined ? options.prefix : '../';
    const mode = options.mode || 'full';

    const html = RESEARCH_PROJECTS.map(function (p) {
        const url = p.external ? p.url : (prefix + p.path);
        const label = mode === 'short' ? p.shortTitle : p.title;
        const externalAttrs = p.external ? ' target="_blank" rel="noopener"' : '';
        const venueTag = (mode === 'full' && p.venue)
            ? ' <span class="tag ' + p.venueClass + ' is-light" style="margin-left: 8px; vertical-align: middle;">' + p.venue + '</span>'
            : '';
        return '<a class="navbar-item" href="' + url + '"' + externalAttrs + '><span class="research-project-title">' + label + '</span>' + venueTag + '</a>';
    }).join('\n                        ');

    container.innerHTML = html;
}

// Auto-render the child-page "More Research" dropdown when present (default: full mode, "../" prefix).
// The main page navbar uses its own inline call with mode:"full" and prefix:"./".
document.addEventListener('DOMContentLoaded', function () {
    renderResearchDropdown('research-dropdown-items');
});
