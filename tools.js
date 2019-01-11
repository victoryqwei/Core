exports.updateIP = function (fs, socket) {
	// Update the ip json file
	fs.readFile('./ip.json', function (err, data) {
		var ips = JSON.parse(data);

		var ip = socket.request.connection.remoteAddress.replace('::ffff:', '')
		var exists = false;
		for (var i = 0; i < ips.all.length; i++) {
			if (ip === ips.all[i]) {
				exists = true;
			}
		}

		if (!exists) {
			ips.all.push(ip);
			fs.writeFile('./ip.json', JSON.stringify(ips), function (err) {})
		}
	})
}