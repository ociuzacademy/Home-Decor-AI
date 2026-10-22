# DECORA Room Preview (Python Flask)

A simple local browser tool: upload a room photo, upload a decor photo, move/resize/rotate the decor over the room, and save the composite image.

This is an image-based preview, not live camera AR. Images are processed in the browser and are not uploaded to Flask.

## Run on Windows

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python app.py
```

Open http://localhost:5000.

## Use
1. Upload a room photo.
2. Upload a decor image. A transparent PNG works best.
3. Drag the decor over the room to place it.
4. Use the size and rotation controls.
5. Click "Download preview" to save the composite.

## For best results
- Use a clear, well-lit room photo.
- Use a decor image with a transparent background (PNG) for clean blending.
- If the product photo has a white or busy background, remove its background first with an image editor/background remover.
- This tool does not automatically understand room geometry, perspective, shadows, or true dimensions. Placement is manual and visual.
