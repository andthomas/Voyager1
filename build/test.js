var data = [{"year":1980,"doy":269,"y":61900,"z":-1356853,"x":8976}]

for (var i = 0; i < data.length; i++) {
  data[i].y = data[i].y + (i * 97.1910112)
  console.log(data[i])
}
