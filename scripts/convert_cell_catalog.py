import glob
import json
import os
import shutil


def sort_media_data(media_list):
    new_image_dict = {"images": []}
    for image in media_list:
        if image["type"] == "image":
            new_image_dict["images"].append(
                {"image": image["link"], "caption": f'"{image["caption"]}"'}
            )
    new_video_dict = {"videos": []}
    for video in media_list:
        if video["type"] == "movie":
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

def process_slash_separated_value(data):
    """
    Convert a string with slash separated values to a list. For lines with multiple gene symbols(59,78,84,86,89).
    """
    if isinstance(data, str) and "/" in data:
        return [item.strip() for item in data.split("/")]
    return [data]

# def get_thumbnails():
#     thumbnail_dict = {}
#     images_path = "./images"

#     all_cell_line_folders = glob.glob(os.path.join(images_path, "AICS-*"))

#     for folder in all_cell_line_folders:
#         folder_name = os.path.basename(folder)
#         cell_line_id = folder_name.split("-")[1]
#         thumbnail_path = os.path.join(folder, "single_plane_image_cl*.jpg")
#         thumbnail_files = glob.glob(thumbnail_path)

#         for thumbnail_file in thumbnail_files:
#             filename = os.path.basename(thumbnail_file)
#             clone_number = filename.replace("single_plane_image_cl", "").replace(".jpg", "")
#             cell_line_name = f"AICS-{int(cell_line_id)}-{clone_number}"
#             thumbnail_dict[cell_line_name] = (filename, thumbnail_file)
#             print(f"Mapped {cell_line_name} -> {filename}")
#     print("total lines", len(thumbnail_dict))

#     return thumbnail_dict

# thumbnail_dict = get_thumbnails()

# def copy_thumbnails(source_path, target_folder, filename):
#     target_path = os.path.join(target_folder, filename)
#     shutil.copy(source_path, target_path)
#     print(f"Copied {filename} to {target_folder}")

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

        jpg_pattern = os.path.join(folder, "*.jpg")
        jpg_files = glob.glob(jpg_pattern)

        if jpg_files:
            for jpg_file in jpg_files:
                filename = os.path.basename(jpg_file)  # e.g., "CDH5_cl41_full_allele.jpg"
                image_info = {
                    "filename": filename,
                    "filepath": jpg_file,
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
        # handle parental line thumbnail image
        # if cell_line_id == 13:
        #     f.write(f"thumbnail_image: aics-{cell_line_id}.jpg\n")
        # elif cell_line_id == 75:
        #     f.write(
        #         "thumbnail_image: 20181023_m02_001_s13_cl85_cropped_scalebar20_withinset_rgb.jpg\n"
        #     )
        # else:
        # if check_status(cell_line["status"]) == "released":
        #     f.write(f"thumbnail_image: {thumbnail_dict[cell_line_name][0]}\n")
        #     thumbnail_file = thumbnail_dict.get(cell_line_name, None)
        #     if thumbnail_file:
        #         filename, source_path = thumbnail_file
        #         copy_thumbnails(source_path, path, filename)
        #     else:
        #         print(f"No thumbnail found for {cell_line_name}, skipping thumbnail copy.")
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
                f.write(f"    - image: {image_name}\n")
                for image in new_image_dict["images"]:
                    if image["image"].split("/")[-1] == image_name:
                        caption = image["caption"]
                        f.write(f"      caption: {caption}\n")
                copy_images(source_path, path, image_name)
        f.write(f"  videos:\n")
        for video in new_video_dict["videos"]:
            f.write(f"    - video: {video['video']}\n")
            f.write(f"      caption: {video['caption']}\n")
        f.write("---")
