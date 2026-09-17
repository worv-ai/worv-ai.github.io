# Real-robot comparison videos

Twelve selected evaluation scenes (three per task), with columns ordered pi0.5,
FrameSamp+Modul, and PonderPounce, for 36 videos. Labels come from each scene's
evaluation records and task summary.
These qualitative examples do not replace the full evaluation results.

| Task | pi0.5 | FrameSamp+Modul | PonderPounce |
| --- | --- | --- | --- |
| PutFruits example 1 | fail | fail | success |
| PutFruits example 2 | fail | success | success |
| PutFruits example 3 | success | success | success |
| TrackCube example 1 | fail | fail | success |
| TrackCube example 2 | fail | fail | success |
| TrackCube example 3 | fail | success | success |
| RepickBlock example 1 | fail | fail | success |
| RepickBlock example 2 | fail | fail | success |
| RepickBlock example 3 | fail | success | success |
| DrawPattern example 1 | fail | success | success |
| DrawPattern example 2 | fail | fail | success |
| DrawPattern example 3 | fail | success | success |

## Preparation

- All rollout frames and their source playback timing are retained.
- PutFruits is an execution-only task. Its MP4s are remuxed with fast-start metadata.
- The other three tasks prepend the corresponding full task demonstration at
  its original playback speed, with a red border. This segment gives the viewer
  task context; it is not part of the policy rollout or evidence that every
  baseline consumes the demonstration.
- The 256x256 demonstrations have 32-pixel top and bottom letterboxing removed,
  then are scaled to the rollout's 640x480 dimensions. No scene content is cropped.
- Combined videos use H.264, 30 fps, yuv420p, CRF 21, and fast-start MP4 metadata.
- JPG posters are sampled 0.5 seconds into the policy rollout.

The PutFruits scene includes a person adding extra fruit to the bin during
execution. The instruction still requires the robot to transfer two fruits itself.
RepickBlock's pi0.5 failure is shown for its full recorded duration.

## Subgoal timelines

The JSONL timelines in `subgoals/` correspond to the displayed PonderPounce videos.

| Task | Prepended demo frames |
| --- | --- |
| PutFruits example 1 | 0 |
| PutFruits example 2 | 0 |
| PutFruits example 3 | 0 |
| TrackCube example 1 | 566 |
| TrackCube example 2 | 576 |
| TrackCube example 3 | 310 |
| RepickBlock example 1 | 169 |
| RepickBlock example 2 | 318 |
| RepickBlock example 3 | 214 |
| DrawPattern example 1 | 226 |
| DrawPattern example 2 | 318 |
| DrawPattern example 3 | 166 |

The page displays the latest nonempty S2 subgoal at
`(step + demoFrames) / 30` seconds. S1 entries are retained in the source files
but do not trigger duplicate captions. Text is displayed verbatim, including
coordinates. Seeking and speed changes use the video's media time.
