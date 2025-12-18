#!/ucrt64/bin/python3
from bs4 import BeautifulSoup
output_file = open("data.json", "w", encoding="utf-8")
output_file.write("{\n")
output_file.write("\t\"models\": [\n")
def write_output(store, grade, name, img_link, base_url, link, price):
    output_file.write("\t\t{\n")
    output_file.write(f'\t\t\t"store":"{store}",\n')
    output_file.write(f'\t\t\t"grade":"{grade}",\n')
    output_file.write(f'\t\t\t"name":"{name}",\n')
    output_file.write(f'\t\t\t"img":"{img_link}",\n')
    output_file.write(f'\t\t\t"link":"{base_url}{link}",\n')
    output_file.write(f'\t\t\t"price":{price}\n')
    output_file.write("\t\t},\n")
def newtype():
    files = [
        ("newtype-eg.html", "EG"), 
        ("newtype-hg.html", "HG"), 
        ("newtype-rg.html", "RG"), 
        ("newtype-mg.html", "MG"), 
        ("newtype-pg.html", "PG")
    ]
    base_url = "https://newtype.us"
    store = "New Type"
    for filename, grade in files:
        with open(filename, "r", encoding="utf8") as txtfile:
            html_doc = txtfile.read()
            soup = BeautifulSoup(html_doc, "html.parser")
            models = soup.find_all(class_="relative flex flex-col")
            for model in models:
                a_tag = model.find_all("a")[-1]
                link = a_tag["href"]
                name = a_tag.text.strip()
                img_link = model.find("img")["src"]
                price_str = model.find("span").text.strip()
                try:
                    price = float(price_str[1:])
                except:
                    continue
                write_output(store, grade, name, img_link, base_url, link, price)
def usagundam():
    files = [
        ("usagundam-eg.html", "EG"),
        ("usagundam-hg.html", "HG"),
        ("usagundam-rg.html", "RG"),
        ("usagundam-mg.html", "MG"),
        ("usagundam-pg.html", "PG")
    ]
    base_url = "https://www.usagundamstore.com"
    store = "USA Gundam Store"
    for filename, grade in files:
        with open(filename, "r", encoding="utf8") as txtfile:
            html_doc = txtfile.read()
            soup = BeautifulSoup(html_doc, "html.parser")
            models = soup.find_all(class_="ss__result grid__item col-lg-3 col-md-6 col-sm-6 col-xs-6 ss__result--item")
            for model in models:
                a_tags = model.find_all("a")
                link = a_tags[0]["href"]
                name = a_tags[-1].text.strip().replace("\"", "\\\"")
                img_link = model.find("img")["data-src"]
                price_str = model.find("s").text.strip()
                price = float(price_str[2:])
                write_output(store, grade, name, img_link, base_url, link, price)
def gundamplanet():
    files = [
        ("gundamplanet-eg.html", "EG"),
        ("gundamplanet-hg.html", "HG"),
        ("gundamplanet-rg.html", "RG"),
        ("gundamplanet-mg.html", "MG"),
        ("gundamplanet-pg.html", "PG")
    ]
    base_url = "https://www.gundamplanet.com/"
    store = "Gundam Planet"
    for filename, grade in files:
        with open(filename, "r", encoding="utf8") as txtfile:
            html_doc = txtfile.read()
            soup = BeautifulSoup(html_doc, "html.parser")
            models = soup.find_all(class_="preview-card")
            for model in models:
                try:
                    link = model.find("a", class_="product-detail-link")["href"]
                    name = model.find("div", class_="preview-card-hovertext-title").text.replace("\n", " ").strip()
                    img_link = model.find("img")["src"]
                    price_str = model.find("span", class_="price-item").text.strip()
                    price = float(price_str[price_str.index("$")+1:])
                    write_output(store, grade, name, img_link, base_url, link, price)
                except:
                    continue
newtype()
usagundam()
gundamplanet()
output_file.write("\t\tnull\n")
output_file.write("\t]\n")
output_file.write("}\n")
output_file.close()
