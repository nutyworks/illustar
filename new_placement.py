import pandas as pd

def deserialize(s):
  if pd.isna(s): return []

  keywords = s.split(";")
  links = []
  name = None

  for keyword in keywords:
    if keyword.startswith("http"):
      if name == None:
        name = keyword.split("/")[2]
      links.append({'name': name, 'link': keyword})
      name = None
    else:
      name = keyword

  return links

def na_or_strify(x):
  return "undefined" if pd.isna(x) else f'"{x}"'

locdata = pd.read_excel("./202310illustar.xlsx", "loc")
locjson = locdata.to_dict(orient='records')
locmap = dict(map(lambda x: (x["loc"], (x["x"], x["y"], x["w"], x["h"])), locjson))

cirdata = pd.read_excel("./202310illustar.xlsx", "circle").iloc[:505, :12]
cirjson = cirdata.to_dict(orient='records')

f = open("src/app/data.tsx", "w")

f.write("export const circleData = [")

for circle in cirjson:
  _id = int(circle['id'])
  days = list(map(int, str(circle['day']).split(";")))
  loc = circle['loc'].split(";")
  pos = []
  for l in loc:
    x, y, width, height = locmap[l]
    pos.append({'x': x, 'y': y, 'w': width, 'h': height})
  name = circle['name']
  repr = deserialize(circle['repr'])
  genre_tags = na_or_strify(circle['genre_tags'])
  character_tags = na_or_strify(circle['character_tags']) 
  type_tags = na_or_strify(circle['type_tags']) 
  info_links = deserialize(circle['info_links'])
  preorder_links = deserialize(circle['preorder_links'])
  netorder_links = deserialize(circle['netorder_links'])
  etc_links = deserialize(circle['etc_links'])

  f.write(
    "{"
    + f'_id:"{_id}",pos:{pos},loc:{loc},repr:{repr},name:"{name}",'
    + f'info_links:{info_links},preorder_links:{preorder_links},'
    + f'netorder_links:{netorder_links},etc_links:{etc_links},'
    + f'days:{days},genre_tags:{genre_tags},character_tags:{character_tags},'
    + f'type_tags:{type_tags}'
    + "},"
  )
f.write("];")

f.close()