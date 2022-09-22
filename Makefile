
setup:
	if which python3 && [ ! -d venv ] ; then python3 -m venv venv ; fi
		source venv/bin/activate \
		&& python -m pip install -q -U pip \
		&& pip install nodeenv \
		&& if [ ! -d nenv ] ; then nodeenv nenv; fi \
		&& source nenv/bin/activate \
		&& if [ -f package.json ] ; then npm install; fi
