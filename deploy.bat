@echo off
echo ===================================================
echo Adding all changes to Git...
git add .
echo.
echo Committing changes...
git commit -m "Update website"
echo.
echo Pushing to GitHub...
git push
echo.
echo Deploying to Vercel...
npx vercel --prod
echo ===================================================
echo Deployment process complete.
pause
