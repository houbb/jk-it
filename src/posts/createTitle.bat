@echo off
setlocal enabledelayedexpansion

for /R "D:\blogs\jk-it\src\posts" %%F in (*.md) do (
    set "filename=%%\~nF"
    (echo # !filename!&echo.&type "%%F") > "%%\~dpFtemp_%%\~nxF"
    move /Y "%%\~dpFtemp_%%\~nxF" "%%F" >nul
    echo DONE: %%F
)

endlocal
echo ALL DONE
pause