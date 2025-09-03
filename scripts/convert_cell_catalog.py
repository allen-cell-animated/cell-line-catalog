import glob
import json
import os
import re
import shutil


def sort_media_data(media_list):
    new_image_dict = {"images": []}
    for image in media_list:
        if image["type"] == "image":
            if "link" in image and "caption" in image:
                new_image_dict["images"].append(
                    {"image": image["link"], "caption": f'"{image.get("caption", "")}"'}
                )
    new_video_dict = {"videos": []}
    for video in media_list:
        if video["type"] == "movie":
            if "link" in video and "caption" in video:
                new_video_dict["videos"].append(
                    {"video": video["link"], "caption": f'"{video["caption"]}"'}
                )
    return new_image_dict, new_video_dict

def check_status(status):
    try:
        if status == "In Progress":
            return "in progress"
        elif status == "Yes":
            return "released"
    except KeyError:
        return "no status found"


def extract_number_from_string(value):
    if isinstance(value, (int, float)):
        return value
    if isinstance(value, str):
        numbers = re.findall(r"\d+\.?\d*", value)
        if numbers:
            num_str = numbers[0]
            if "." in num_str:
                return float(num_str)
            else:
                return int(num_str)
    return value


def safe_float_conversion(value):
    if isinstance(value, (int, float)):
        return float(value)
    if isinstance(value, str):
        try:
            return float(value)
        except ValueError:
            return value
    return value


def process_slash_separated_value(data):
    """
    Convert a string with slash separated values to a list. For lines with multiple gene symbols(59,78,84,86,89).
    """
    if isinstance(data, str) and "/" in data:
        return [item.strip() for item in data.split("/")]
    return [data]

def sort_images_with_thumbnail_first(images_list):
    thumbnail_images = [img for img in images_list if "single_plane_image_cl" in img["filename"]]
    other_images = [img for img in images_list if "single_plane_image_cl" not in img["filename"]]
    return thumbnail_images + other_images

def get_all_images():
    images_dict = {}
    images_path = "./images"

    all_cell_line_folders = glob.glob(os.path.join(images_path, "AICS-*"))

    for folder in all_cell_line_folders:
        folder_name = os.path.basename(folder)  # e.g., "AICS-0126"
        cell_line_id = int(folder_name.split("-")[1])
        images_dict[cell_line_id] = []

        all_files = glob.glob(os.path.join(folder, "*"))
        jpg_files = [f for f in all_files if f.lower().endswith((".jpg", ".jpeg"))]
        png_files = [f for f in all_files if f.lower().endswith(".png")]

        all_images = jpg_files + png_files

        if all_images:
            for image in all_images:
                filename = os.path.basename(image)  # e.g., "CDH5_cl41_full_allele.jpg"
                image_info = {
                    "filename": filename,
                    "filepath": image,
                }
                images_dict[cell_line_id].append(image_info)
                print(f"Found {folder_name}/{filename} in {folder_name}")
    # Sort images with thumbnail first
    for cell_line_id, images in images_dict.items():
        images_dict[cell_line_id] = sort_images_with_thumbnail_first(images)
    return images_dict

images_dict = get_all_images()


def copy_images(source_path, target_folder, filename):
    target_path = os.path.join(target_folder, filename)
    shutil.copy(source_path, target_path)
    print(f"Copied {filename} to {target_folder}")


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

    tag_locations = process_slash_separated_value(cell_line["Main_terminal_tagged"])
    fluoresecent_tags = process_slash_separated_value(cell_line["Main_fluorescent_tag"])
    allele_counts = process_slash_separated_value(cell_line["alleleCount"])
    mods = max(len(tag_locations), len(fluoresecent_tags), len(allele_counts), len(gene_symbols))

    # print(f"{gene_symbol} {protein} {gene_id} {gene_name} {isoform} {structure}")
    # if len(gene_symbols) > 1:
    # print(f"Multiple gene symbols found for {gene_symbols}")
    # continue
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

    def write_editing_design_section(f, cell_line):
        # Extract editing design data
        ncbi_isoform = cell_line.get("EditingDesign_NCBI_isoform", "")
        crna_seq = cell_line.get("EditingDesign_crRNA_seq", "")
        linker = cell_line.get("Main_linker", "")
        cas9 = cell_line.get("EditingDesign_cas9", "")
        gene_figure = cell_line.get("EditingDesign_gene_figure", "")
        gene_figure_caption = cell_line.get("EditingDesign_gene_figure_caption", "")

        f.write("editing_design:\n")
        f.write(f"  ncbi_isoforms:\n")
        f.write(f"    - {ncbi_isoform}\n")
        f.write(f"  crna: {crna_seq}\n")
        f.write(f"  linker: {linker}\n")
        f.write(f"  cas9: {cas9}\n")

        if gene_figure and gene_figure_caption:
            f.write("  diagrams:\n")
            f.write("    - title: \"mEGFP Insert\"\n")
            f.write("      images:\n")

            # Extract filename from path
            image_filename = os.path.basename(gene_figure)
            f.write(f"        - image: {image_filename}\n")
            f.write(f"          caption: \"{gene_figure_caption}\"\n")

    def write_genomic_characterization_section(f, cell_line):
        f.write("genomic_characterization:\n")

        diagrams = []
        junction_schematic = cell_line.get("GenomicCharacterization_junction_schematic", "")
        if junction_schematic:
            diagrams.append({
                "title": "Schematic of Junctions",
                "images": [{
                    "image": os.path.basename(junction_schematic),
                    "caption": "" 
                }]
            })

        tagged_allele_gel = cell_line.get("GenomicCharacterization_tagged_allele_gel", "")
        tagged_allele_gel_caption = cell_line.get("GenomicCharacterization_tagged_allele_gel_caption", "")
        if tagged_allele_gel:
            diagrams.append({
                "title": "GFP-tagged and untagged alleles",
                "images": [{
                    "image": os.path.basename(tagged_allele_gel),
                    "caption": tagged_allele_gel_caption
                }]
            })

        karyotype_image = cell_line.get("StemCellCharacterization_karyotype", "")
        karyotype_caption = cell_line.get("StemCellCharacterization_karyotype_caption", "")
        if karyotype_image:
            diagrams.append({
                "title": "Karyotype Analysis",
                "images": [{
                    "image": os.path.basename(karyotype_image),
                    "caption": karyotype_caption
                }]
            })

        if diagrams:
            f.write("  diagrams:\n")
            for diagram in diagrams:
                f.write(f"    - title: \"{diagram['title']}\"\n")
                f.write("      images:\n")
                for image in diagram['images']:
                    f.write(f"        - image: {image['image']}\n")
                    if image['caption']:
                        f.write(f"          caption: \"{image['caption']}\"\n")

        junction_table = cell_line.get("GenomicCharacterization_junction_table", [])
        if junction_table:
            f.write("  amplified_junctions:\n")
            for junction in junction_table:
                f.write("    - editedGene: \"{}\"\n".format(junction.get("editedGene", "")))
                f.write("      junction: \"{}\"\n".format(junction.get("junction", "")))
                f.write("      expected_size: \"{}\"\n".format(junction.get("expected_size", "")))
                f.write("      confirmed_sequence: \"{}\"\n".format(junction.get("confirmed_sequence", "")))

        junction_table_caption = cell_line.get("GenomicCharacterization_junction_table_caption", "")
        if junction_table_caption:
            f.write(f"  junction_table_caption: \"{junction_table_caption}\"\n")

        ddpcr_data = cell_line.get("GenomicCharacterization_ddpcr", [])
        if ddpcr_data:
            f.write("  ddpcr:\n")
            for ddpcr in ddpcr_data:
                clone_value = extract_number_from_string(ddpcr.get("clone", None))
                fp_ratio_value = safe_float_conversion(ddpcr.get("fp_ratio", None))
                plasmid_value = safe_float_conversion(ddpcr.get("plasmid", None))
                f.write("    - tag: {}\n".format(ddpcr.get("gene_tag", "")))
                f.write("      clone: {}\n".format(clone_value))
                f.write("      fp_ratio: {}\n".format(fp_ratio_value))
                f.write("      plasmid: {}\n".format(plasmid_value))

        ddpcr_caption = cell_line.get("GenomicCharacterization_ddpcr_caption", "")
        if ddpcr_caption:
            f.write(f"  ddpcr_caption: \"{ddpcr_caption}\"\n")

        offtargets = cell_line.get("GenomicCharacterization_offtargets", [])
        if offtargets:
            f.write("  cr_rna_off_targets:\n")
            for offtarget in offtargets:
                f.write("    - clones_analyzed: {}\n".format(offtarget.get("clonesAnalyzed", "")))
                f.write("      off_targets_sequenced_per_clone: {}\n".format(offtarget.get("off-targetsSequenced", "")))
                total_sites = offtarget.get("sitesSequenced", "")
                f.write("      total_sites_sequenced: {}\n".format(total_sites))
                f.write("      mutations_identified: {}\n".format(offtarget.get("mutationsIdentified", "")))
            f.write("  off_targets_caption: \"{}\"\n".format(cell_line.get("GenomicCharacterization_offtargets_caption", "")))

    # Main cell line data
    directory = "./cell-lines"
    if not os.path.exists(directory):
        os.mkdir(directory)
    cell_line_id = int(cell_line["cell_line_id"].split("-")[1])
    if cell_line['clone_number']:
        cell_line_name = f"AICS-{cell_line_id}-{cell_line['clone_number']}"
    else:
        cell_line_name = f"AICS-{cell_line_id}-in-progress"
    path = f"./cell-lines/{cell_line_name}"
    if not os.path.exists(path):
        os.mkdir(path)  # create directory

    new_image_dict, new_video_dict = sort_media_data(cell_line["Main_media"])
    with open(f"./cell-lines/{cell_line_name}/index.md", "w") as f:
        f.write("---\n")
        f.write("templateKey: cell-line\n")
        f.write(f"cell_line_id: {cell_line_id}\n")
        f.write(f"status: {check_status(cell_line['status'])}\n")
        f.write(f"clone_number: {cell_line['clone_number']}\n")
        f.write(f"parental_line: 0\n")
        f.write(f"genetic_modifications:\n")
        for mod in range(mods):
            f.write(f"  - gene: {gene_symbols[mod]}\n")
            f.write(f"    tag_location: {tag_locations[mod]}\n")
            f.write(f"    fluorescent_tag: {fluoresecent_tags[mod]}\n")
            f.write(f"    allele_count: {allele_counts[mod]}\n")
        f.write(f"order_link: {cell_line['Main_order_link']}\n")
        f.write(f"certificate_of_analysis: {cell_line['Main_cofa']}\n")
        # In progress cell lines (AICS 70 and 122) have only limited data, check the keys before accessing
        f.write(f"donor_plasmid: {cell_line.get('Main_donor_plasmid', '')}\n")
        f.write(f"eu_hpsc_reg: {cell_line.get('Main_eu_hpsc_reg', '')}\n")
        f.write(f"images_and_videos:\n")
        if check_status(cell_line["status"]) == "released":
            f.write(f"  images:\n")
            images = images_dict.get(cell_line_id, [])
            for image in images:
                image_name = image["filename"]
                source_path = image["filepath"]
                for image in new_image_dict["images"]:
                    if image["image"].split("/")[-1] == image_name:
                        caption = image["caption"]
                        f.write(f"    - image: {image_name}\n")
                        f.write(f"      caption: {caption}\n")
                copy_images(source_path, path, image_name)
        f.write(f"  videos:\n")
        for video in new_video_dict["videos"]:
            f.write(f"    - video: {video['video']}\n")
            f.write(f"      caption: {video['caption']}\n")

        write_editing_design_section(f, cell_line)
        write_genomic_characterization_section(f, cell_line)
        f.write("---")
