import pandas as pd

def na_or_strify(x):
  return "undefined" if pd.isna(x) else f'"{x}"'

locdata = pd.read_excel("./info.xlsx", "loc")
locjson = locdata.to_dict(orient='records')
locmap = dict(map(lambda x: (x["loc"], (x["x"], x["y"], x["w"], x["h"])), locjson))

cirdata = pd.read_excel("./info.xlsx", "circle").iloc[:, :12]
cirjson = cirdata.to_dict(orient='records')

f = open("src/app/data.tsx", "w")

f.write("export const circleData = [")

for circle in cirjson:
  _id = circle['cid']
  loc = circle['loc']
  x, y, width, height = locmap[loc]
  name, repr, tags = circle['cname'], na_or_strify(circle['repr']), na_or_strify(circle['tags'])
  urls = []
  days = []
  if circle['sat'] == 1: days.append(0)
  if circle['sun'] == 1: days.append(1)

  for col in ['info_link1', 'info_link2', 'form_link1', 'form_link2', 'etc_link']:
    link = circle[col]
    if pd.isna(link): continue
    urls.append(link)

  f.write(
    "{"
    + f'_id:{_id},xPos:{x},yPos:{y},width:{width},height:{height},loc:"{loc}",repr:{repr},name:"{name}",urls:{urls},days:{days},tags:{tags}'
    + "},"
  )
f.write("];")

f.close()

"""
  {
    xPos: 0,
    yPos: 0,
    width: 15,
    height: 25,
    id: "A1",
    name: "Lorem ipsum",
    urls: [],
    days: [],
  },
"""
