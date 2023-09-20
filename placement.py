import pandas as pd

data = pd.read_excel("./info.xlsx", "loc")
j = data.to_dict(orient='records')

f = open("src/app/data.tsx", "w")

f.write("export const circleData = [")

for ij in j:
  _id, x, y, width, height = ij['loc'], ij['x'], ij['y'], ij['w'], ij['h']
  name = "test" + _id
  urls = []
  days = []
  f.write(
    "{"
    + f'xPos:{x},yPos:{y},width:{width},height:{height},id:"{_id}",name:"{name}",urls:{urls},days:{days}'
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
