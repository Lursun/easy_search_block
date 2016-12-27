child_process=require('child_process');
fs=require('fs');
module.exports=function(server){
	server.get(/search\/(0{8}\w+)\/?/,(req,rsp)=>{

		child_process.exec(`~/bitcoin-cli getblock ${req.params[0]}`,(err, stdout, stderr) =>
		{
			body=stdout.replace(/(\"(nextblockhash|previousblockhash)\": \")(0{8}\w+)\"/g,"$1<a href=./$3>$3</a>");
			tx=body.match(/\"tx\": (\[[\w\W]+?\])/,"$1");
			
			tx=tx[1].replace(/\"(\w+?)\"/g,"\"<a href=./$1>$1</a>\"");
			
			body=body.replace(/\"tx\": (\[[\w\W]+?\])/,"\"tx\": "+tx);
			body=body.replace(/\n/g,"<br>");
  			rsp.send(`區塊內容:${body}`);
		});
	})
	server.get(/search\/(\w{64})\/?/,(req,rsp)=>{
		rsp.setHeader('content-type', 'text/plain');
		child_process.exec(`~/bitcoin-cli decoderawtransaction \`~/bitcoin-cli getrawtransaction ${req.params[0]}\``,(err, stdout, stderr) =>
		{
  			rsp.send(`交易資訊 ${stdout}`);
		});
		
	})
	server.get(/search\/(\w{34})\/?/,(req,rsp)=>{
		rsp.setHeader('content-type', 'text/plain');
		child_process.exec(`~/bitcoin-cli getblock ${req.params[0]}`,(err, stdout, stderr) =>
		{

  			rsp.send(`地址資訊:${stdout}`);
		});
	})
	server.get(/search\/(\d+)\/?/,(req,rsp)=>{
		
		child_process.exec(`~/bitcoin-cli getblock \`~/bitcoin-cli getblockhash ${req.params[0]}\``,(err, stdout, stderr) =>
		{
			body=stdout.replace(/(\"(nextblockhash|previousblockhash)\": \")(0{8}\w+)\"/g,"$1<a href=./$3>$3</a>");
			tx=body.match(/\"tx\": (\[[\w\W]+?\])/,"$1");
			tx=tx[1].replace(/\"(\w+?)\"/g,"\"<a href=./$1>$1</a>\"");
			
			body=body.replace(/\"tx\": (\[[\w\W]+?\])/,"\"tx\": "+tx);
			body=body.replace(/\n/g,"<br>");
  			rsp.send(`區塊內容:${body}`);
		});
  			
		
	})

	server.get(/search\/\w+\/?/,(req,rsp)=>{
		rsp.send("無法辨識")
	})
	//server.get(/([\w\W]*)/,(req,rsp)=>{
	//	
//		text=fs.readFileSync(`.${req.params[0]}`, 'utf8');
//		rsp.send(text);
//	})
}