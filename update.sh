cd Compass       && (git add . && git commit -m "$*" && git push ; true) && cd .. && \
cd Compass-API   && (git add . && git commit -m "$*" && git push ; true) && cd .. && \
cd Quill-Lessons && (git add . && git commit -m "$*" && git push ; true) && cd ..
