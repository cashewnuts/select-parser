antlr4=java -jar ~/local/lib/antlr-4.7.2-complete.jar
grun=java org.antlr.v4.gui.TestRig

all: test
	echo "test all"

test: antlr-js
	echo "test"

antlr-js: grammer/SSQL.g4
	$(antlr4) -o lib -Dlanguage=JavaScript grammer/SSQL.g4
