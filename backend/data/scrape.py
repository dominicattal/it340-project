#!/ucrt64/bin/python3
from bs4 import BeautifulSoup
test_file = open("test.txt", "w")
output_file = open("data.json", "w")
files = [("eg.txt", "EG"), ("hg.txt", "HG"), ("rg.txt", "RG"), ("mg.txt", "MG"), ("pg.txt", "PG")]
output_file.write("{\n")
output_file.write("\t\"models\": [\n")
for filename, grade in files:
    with open(filename, "r", encoding="utf8") as txtfile:
        html_doc = txtfile.read()
        soup = BeautifulSoup(html_doc, "html.parser")
        models = soup.find_all(class_="relative flex flex-col")
        for model in models:
            name = model.find_all("a")[-1].text.strip()
            img_link = model.find("img")["src"]
            price_str = model.find("span").text.strip()
            try:
                price = float(price_str[1:])
                test_file.write(f'\t\t"name":"{name}",')
            except:
                continue
            output_file.write("\t{\n")
            output_file.write(f'\t\t"grade":"{grade}",\n')
            output_file.write(f'\t\t"name":"{name}",\n')
            output_file.write(f'\t\t"img":"{img_link}",\n')
            output_file.write(f'\t\t"price":{price}\n')
            output_file.write("\t},\n")
output_file.write("\tnull\n")
output_file.write("\t]\n")
output_file.write("}\n")
output_file.close()
