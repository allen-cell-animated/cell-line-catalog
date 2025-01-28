import json
import os


def sort_media_data(media_list):
    new_media_dict = {"images": [], "videos": []}
    for media in media_list:
        if media["type"] == "image":
            new_media_dict["images"].append(
                {"image": media["link"], "caption": media["caption"]}
            )
        elif media["type"] == "movie":
            new_media_dict["videos"].append(
                {"video": media["link"], "caption": media["caption"]}
            )
    return new_media_dict

def check_status(status):
    try:
        if status == "In Progress":
            return "in progress"
        elif status == "Yes":
            return "released"
    except KeyError:
        return "no status found"


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
    new_media_data = sort_media_data(cell_line["Main_media"])
    with open(f"./cell-lines/AICS-{cell_line_id}/index.md", "w") as f:
        f.write("---\n")
        f.write("templateKey: cell-line\n")
        f.write(f"cell_line_id: {cell_line_id}\n")
        f.write(f"status: {check_status(cell_line['status'])}\n")
        # handle parental line thumbnail image
        if cell_line_id == 13:
            f.write("date: 2024-02-27T01:25:04.306Z\n")
            f.write(f"thumbnail_image: aics-{cell_line_id}.jpg\n")
        elif cell_line_id == 75:
            f.write("date: 2024-02-06T04:38:23.506Z\n")
            f.write(
                "thumbnail_image: 20181023_m02_001_s13_cl85_cropped_scalebar20_withinset_rgb.jpg\n"
            )
        f.write(f"clone_number: {cell_line['clone_number']}\n")
        f.write(f"allele_count: {cell_line['alleleCount']}\n")
        f.write(f"parental_line: 0\n")
        f.write(f"gene: {gene_symbol}\n")
        f.write("tag_location:\n")
        f.write(f"  - {cell_line['Main_terminal_tagged']}\n")
        f.write("fluorescent_tag:\n")
        f.write(f"  - {cell_line['Main_fluorescent_tag']}\n")
        f.write(f"order_link: {cell_line['Main_order_link']}\n")
        f.write(f"cofa: {cell_line['Main_cofa']}\n")
        # In progress cell lines (AICS 70 and 122) have only limited data, check the keys before accessing
        f.write(f"donor_plasmid: {cell_line.get('Main_donor_plasmid', '')}\n")
        f.write(f"eu_hpsc_reg: {cell_line.get('Main_eu_hpsc_reg', '')}\n")
        f.write(f"images_and_videos:\n")
        f.write(f"  images:\n")
        for image in new_media_data["images"]:
            f.write(f"    - image: {image['image']}\n")
            f.write(f"      caption: {image['caption']}\n")
        f.write(f"  videos:\n")
        for video in new_media_data["videos"]:
            f.write(f"    - video: {video['video']}\n")
            f.write(f"      caption: {video['caption']}\n")
        f.write("---")
