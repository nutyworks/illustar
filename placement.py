import pandas as pd

locdata = pd.read_excel("./info.xlsx", "loc")
locjson = locdata.to_dict(orient='records')
locmap = dict(map(lambda x: (x["loc"], (x["x"], x["y"], x["w"], x["h"])), locjson))

cirdata = pd.read_excel("./info.xlsx", "circle").iloc[:, :12]
cirjson = cirdata.to_dict(orient='records')

f = open("src/app/data.tsx", "w")

f.write("export const circleData = [")

for ij in cirjson:
  loc = ij['loc']
  x, y, width, height = locmap[loc]
  name, repr, tags = ij['cname'], ij['repr'], ij['tags']
  urls = []
  days = []
  if ij['sat'] == 1: days.append(0)
  if ij['sun'] == 1: days.append(1)
  f.write(
    "{"
    + f'xPos:{x},yPos:{y},width:{width},height:{height},loc:"{loc}",repr:"{repr}",name:"{name}",urls:{urls},days:{days},tags:"{tags}"'
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
