#/bin/bash

rollup -c rollup.config.js
rsync -ar * saturnus:/var/data/html/beta/puntenwolken
