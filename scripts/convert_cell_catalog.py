import json
import os

with open("./data/cell_line_catalog.json", "r") as f:
    data = cell_line_catalog = json.load(f)

for cell_line in data:
    # gene data
    gene_symbols = cell_line["Main_gene_symbol"]
    gene_symbol = gene_symbols[0]
    protein = cell_line["Main_protein"]
    gene_id = cell_line["Main_gene_id"]
    gene_name = cell_line["Main_gene_name"]
    isoform = cell_line["Main_isoforms"]
    structure = cell_line["Main_structure"]

    # print(f"{gene_symbol} {protein} {gene_id} {gene_name} {isoform} {structure}")
    if len(gene_symbols) > 1:
        print(f"Multiple gene symbols found for {gene_symbols}")
        continue
    # with open(f"./genes/{gene_symbol.lower()}.md", "w") as f:
    #     f.write("---\n")
    #     f.write("templateKey: gene-name\n")
    #     f.write(f"symbol: {gene_symbol}\n")
    #     f.write(f"name: {gene_name}\n")
    #     f.write(f"protein: {protein}\n")
    #     f.write(f"structure: {structure}\n")
    #     if len(isoform) > 0:
    #         f.write(f"isoforms:\n")
    #         for iso in isoform:
    #             gene_name = iso["gene_name"]
    #             gene_isoforms = iso["gene_isoforms"]
    #             f.write(f"  - name: {gene_name}\n")
    #             if len(gene_isoforms) > 0:
    #                 f.write(f"    ids:\n")
    #                 for key in gene_isoforms:
    #                     f.write(f"      - {key}\n")
    #     f.write("---")

    # Main cell line data
    directory = "./cell-lines"
    if not os.path.exists(directory):
        os.mkdir(directory)
    cell_line_id = int(cell_line["cell_line_id"].split("-")[1])
    path = f"./cell-lines/AICS-{cell_line_id}"
    if not os.path.exists(path):
        os.mkdir(f"./cell-lines/AICS-{cell_line_id}")  # create directory
    with open(f"./cell-lines/AICS-{cell_line_id}/index.md", "w") as f:
        f.write("---\n")
        f.write("templateKey: cell-line\n")
        f.write(f"cell_line_id: {cell_line_id}\n")
        f.write(f"status: released\n")
        f.write(f"clone_number: {cell_line['clone_number']}\n")
        f.write(f"allele_count: {cell_line['alleleCount']}\n")
        f.write(f"parental_line: 0\n")
        f.write(f"gene: {gene_symbol}\n")
        f.write("tag_location:\n")
        f.write(f"  - {cell_line['Main_terminal_tagged']}\n")
        f.write("fluorescent_tag:\n")
        f.write(f"  - {cell_line['Main_fluorescent_tag']}\n")
        f.write(f"order_link: {cell_line['Main_order_link']}\n")
        f.write("---")
