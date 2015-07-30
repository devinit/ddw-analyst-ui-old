
iojs and npm install for a single user
--------------------------------------


Install nvm ( node version manager ) from https://github.com/creationix/nvm


	curl https://raw.githubusercontent.com/creationix/nvm/v0.23.2/install.sh | bash


Install io.js using nvm.


	nvm install io.js
	nvm alias default iojs


This hooks into your shell startup scripts so you will need to start a new shell or relogin for it to finish installing.

You can now use npm and iojs the same way you would run node.

	npm --help
	iojs --help


