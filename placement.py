import pandas as pd

locdata = pd.read_excel("./info.xlsx", "loc")
locjson = locdata.to_dict(orient='records')

cirdata = pd.read_excel("./info.xlsx", "circle").iloc[:, :12]
cirjson1 = cirdata.loc[cirdata['sat'] == 1].to_dict(orient='records')
cirjson2 = cirdata.loc[cirdata['sun'] == 1].to_dict(orient='records')

cirmap1 = dict(map(lambda x: (x['loc'], x), cirjson1))
cirmap2 = dict(map(lambda x: (x['loc'], x), cirjson2))

f = open("src/app/data.tsx", "w")

f.write("export const circleData = [[")

for ij in locjson:
  _id = ij['loc']
  if _id not in cirmap1: continue
  x, y, width, height, name, repr = ij['x'], ij['y'], ij['w'], ij['h'], cirmap1[_id]['cname'], cirmap1[_id]['repr']
  urls = []
  days = []
  f.write(
    "{"
    + f'xPos:{x},yPos:{y},width:{width},height:{height},id:"{_id}",repr:"{repr}",name:"{name}",urls:{urls},days:{days}'
    + "},"
  )

f.write("],[")

for ij in locjson:
  _id = ij['loc']
  if _id not in cirmap2: continue
  x, y, width, height, name, repr = ij['x'], ij['y'], ij['w'], ij['h'], cirmap2[_id]['cname'], cirmap2[_id]['repr']
  urls = []
  days = []
  f.write(
    "{"
    + f'xPos:{x},yPos:{y},width:{width},height:{height},id:"{_id}",repr:"{repr}",name:"{name}",urls:{urls},days:{days}'
    + "},"
  )

f.write("]];")

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
