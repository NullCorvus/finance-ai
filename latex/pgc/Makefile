PDF=main.pdf
TEX=main.tex

pdf:
	latexmk -pdf -interaction=nonstopmode $(TEX)

clean:
	latexmk -C
	rm -f *.aux *.log *.out *.toc *.lof *.lot *.fls *.fdb_latexmk *.synctex.gz

view: pdf
	xdg-open $(PDF) 2>/dev/null || open $(PDF) 2>/dev/null || echo "Open $(PDF) manually"

.PHONY: pdf clean view
