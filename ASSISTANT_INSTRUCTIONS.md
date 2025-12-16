SMART POTATO FARMING SYSTEM – SPROUT LENGTH COMPONENT
Step■by■step guide: from dataset to personalized feedback
------------------------------------
1. GOAL OF YOUR COMPONENT
------------------------------------
You are building the “Seed Readiness Predictor” for potatoes using images.
From one or more photos, your system should:
• Detect each seed potato in the image.
• For each potato, estimate:
 – Sprout length category: SHORT / MEDIUM / LONG
 – Shriveling score: 0.0 (no shrivel) → 1.0 (severely shriveled)
 – Damage score: 0.0 (no damage) → 1.0 (severely damaged)
• Combine these values to decide if each potato is READY or NOT READY for planting.
• Give simple, personalized feedback to the farmer (which potatoes to keep/remove).
This guide explains all steps, in simple English, starting from creating the dataset.
------------------------------------
2. DEFINE YOUR LABELS AND SCORES
------------------------------------
Before taking any photos, fix your labels and scoring rules. Use the same rules always.
2.1 Sprout length categories
You cannot measure exact centimetres easily in the field, so use three simple classes:
• SHORT – very small buds / sprouts (about 0–1 cm)
• MEDIUM – clearly visible sprouts (about 1–3 cm)
• LONG – big, long sprouts (more than about 3 cm)
For your project, you can decide “ideal” seed readiness range, for example:
• Ideal sprout length for planting: MEDIUM
• SHORT → not yet ready
• LONG → maybe over■sprouted (can be fragile)
2.2 Shriveling (wrinkling) score
Shriveling shows how dry or old the potato is.
Give a score between 0 and 1:
• 0.0 → no shriveling (smooth skin)
• 0.3 → little shriveling
• 0.6 → clearly wrinkled
• 1.0 → extremely shriveled
You do not need to be perfect. Just be consistent.
2.3 Damage score
Damage means cuts, bruises, rotting, etc. on the surface.
Again, give a score between 0 and 1:
• 0.0 → no damage
• 0.3 → small, minor marks
• 0.6 → visible, worrying damage
• 1.0 → heavy damage or rot
2.4 Seed readiness decision
Later, the model (or a simple rule) can use:
• sprout_length_category
• shrivel_score
• damage_score
to decide:
• READY – good for planting
• NOT READY – not suitable or needs more time
Example simple rule:
• READY if: sprout = MEDIUM AND shrivel_score < 0.5 AND damage_score < 0.5
• Otherwise NOT READY
You can adjust these thresholds based on agronomy advice.
------------------------------------
3. PLANNING YOUR DATASET
------------------------------------
3.1 What kind of photos?
For your first version, use single■tuber images:
• 1 potato per image
• Clean, plain background (white paper or tile)
• Good light (daylight or uniform indoor light)
• Camera at fixed height (for example 30–40 cm above the potato)
• Sprouts clearly visible
Later, you can also add images with multiple potatoes. But start simple.
3.2 How many images?
For a student project, a realistic target:
• 70–100 images per sprout length class (SHORT / MEDIUM / LONG)
• Total ~200–300 images minimum for your first model
More images → better results, but this is enough to train and demo.
3.3 Category balance
Try to capture a balanced dataset:
• Similar number of SHORT, MEDIUM, LONG examples
• Within each class, include:
 – Some smooth potatoes (low shrivel)
 – Some wrinkled potatoes (high shrivel)
 – Some damaged potatoes
This helps the model generalize.
------------------------------------
4. CAPTURING IMAGES
------------------------------------
4.1 Setup
• Place an A4 white paper on a flat surface (table, floor, etc.).
• Put ONE potato tuber in the centre.
• Keep the camera at a fixed height above the paper.
• Make sure there are no strong shadows on the potato.
4.2 Angles per potato
For each potato:
• Decide its sprout length category first (by eye): SHORT / MEDIUM / LONG.
• Then take 3–5 photos from different angles:
 – Top view
 – Side view
 – Slight diagonal view
All these photos belong to the same sprout category for that potato.
4.3 File naming convention
Use a consistent, informative file name, for example:
potato_001_short_0.2_0.1.jpg
potato_001_short_0.2_0.1_view2.jpg
potato_001_short_0.2_0.1_view3.jpg
Meaning:
• 001 → potato ID
• short → sprout length category
• 0.2 → shriveling score
• 0.1 → damage score
• view2 → second angle of the same potato
Another example:
potato_025_medium_0.1_0.0.jpg (medium sprout, almost no shrivel, no damage)
potato_046_long_0.7_0.8.jpg (long sprout, very shriveled, heavily damaged)
You can also store these labels in a CSV file instead of the filename.
------------------------------------
5. ORGANIZING AND LABELING THE DATA
------------------------------------
Create a folder structure like:
dataset/
 train/
 images/
 labels.csv
 val/
 images/
 labels.csv
5.1 labels.csv format
Inside each labels.csv, you can have columns like:
image_name, sprout_class, shrivel_score, damage_score, readiness_label
potato_001_short_0.2_0.1.jpg, short, 0.2, 0.1, not_ready
potato_025_medium_0.1_0.0.jpg, medium, 0.1, 0.0, ready
potato_046_long_0.7_0.8.jpg, long, 0.7, 0.8, not_ready
At the beginning, YOU decide the readiness_label using your simple rule.
This CSV is the ground truth for training and testing the model.
------------------------------------
6. DESIGNING YOUR MODEL (HIGH LEVEL)
------------------------------------
You can use a CNN with multiple outputs (multi■task model), or separate models.
Simpler approach for your project:
• Model A – image classifier for sprout length (SHORT / MEDIUM / LONG)
• Model B – regression model for shrivel_score (0–1)
• Model C – regression model for damage_score (0–1)
Later, you combine these three outputs into a final readiness decision in your backend
logic.
6.1 Training data
• Input: image
• Targets:
 – sprout_class (for Model A)
 – shrivel_score (for Model B)
 – damage_score (for Model C)
You can implement these with:
• PyTorch or TensorFlow/Keras on the backend
• Use pre■trained CNN backbone (e.g. ResNet18, MobileNet) for faster training.
------------------------------------
7. TRAIN / VALIDATE / TEST
------------------------------------
7.1 Train/Val/Test split
Split your dataset into three sets:
• Train: 70% of images
• Validation: 15% of images
• Test: 15% of images
Make sure the same potato ID does not appear in both train and test.
7.2 Metrics
For sprout_class (classification):
• Accuracy – % of correct SHORT/MEDIUM/LONG predictions
For shrivel_score and damage_score (regression):
• Mean Absolute Error (MAE) – average absolute difference between true score and predicted
score
You do not need perfect numbers for your project, but show that:
• Accuracy is reasonably high (for example >70%).
• MAE is reasonably low (for example ≤0.15 on the 0–1 scale).
------------------------------------
8. BACKEND INTEGRATION (FLASK)
------------------------------------
Your backend (Flask) will:
1. Receive image(s) from the web app (React frontend).
2. Run the trained models (A, B, C) on each image.
3. For each detected potato, produce:
 • sprout_class
 • shrivel_score
 • damage_score
4. Apply readiness rules.
5. Send JSON response back to the frontend.
Example JSON response for one image with 3 potatoes:
{
 "potatoes": [
 {
 "id": 1,
 "sprout_class": "medium",
 "shrivel_score": 0.2,
 "damage_score": 0.1,
 "ready": true
 },
 {
 "id": 2,
 "sprout_class": "short",
 "shrivel_score": 0.1,
 "damage_score": 0.0,
 "ready": false
 },
 {
 "id": 3,
 "sprout_class": "long",
 "shrivel_score": 0.7,
 "damage_score": 0.6,
 "ready": false
 }
 ],
 "overall_summary": "...some text..."
}
------------------------------------
9. PERSONALIZED FEEDBACK LOGIC
------------------------------------
After you have the predictions, you create farmer■friendly messages.
9.1 Per■potato feedback
For each potato, decide feedback based on:
• sprout_class
• shrivel_score
• damage_score
Examples:
• If sprout_class = medium AND shrivel_score < 0.5 AND damage_score < 0.5:
 → “This seed is READY for planting.”
• If sprout_class = short:
 → “Sprouts are still short. You can wait a bit more before planting.”
• If sprout_class = long:
 → “Sprouts are too long. Handle carefully or consider not using this tuber.”
• If damage_score ≥ 0.7:
 → “This tuber is heavily damaged. Better to remove it.”
• If shrivel_score ≥ 0.7:
 → “This tuber is very shriveled and dry. Not ideal as seed.”
9.2 Image■level / lot■level feedback
If one image (or one batch) has many potatoes, you can:
• Count how many are READY vs NOT READY.
• Highlight the worst potatoes (highest damage/shrivel).
Example final message for the farmer:
• “Out of 10 potatoes in this photo, 7 are good for planting.
 Potatoes 2, 5, and 9 are not recommended because they are too damaged or shriveled.”
In the UI, you can:
• Show the image.
• Draw a box or outline around each bad potato.
• Show a small text bubble: “Remove this one” or “Too damaged”.
This is your personalized feedback.
------------------------------------
10. HOW THE WHOLE PIPELINE FLOWS
------------------------------------
1) You define labels (sprout_class) and scores (shrivel, damage).
2) You capture images with a clean, consistent setup.
3) You label each image (or each potato) with these values.
4) You split data into train/val/test and train your models.
5) You build a Flask API endpoint that runs the models and returns predictions.
6) You write a simple rule■based layer that converts predictions into advice.
7) Your React frontend allows the farmer to upload 1 or many photos.
8) Backend processes images and sends results.
9) Frontend shows visual highlights and text feedback:
 • which seeds to plant,
 • which to remove,
 • and a simple readiness summary.
If you follow these steps, you will have:
• A clear dataset creation method,
• A working ML pipeline,
• And a meaningful, personalized output for farmers –
 all based on your sprout■length component.