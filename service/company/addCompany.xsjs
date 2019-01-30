$.import("MSS_MOBILE.Functions", "Functions");
var functions = $.MSS_MOBILE.Functions;
var objResponse;
var objResult;
var objType;

function GetLastKey(){
	try	{
		var query = 'select IFNULL(max("id"),0) as "Last" from "SBO_MSS_MOBILE"."EMPRESAS"';
		var conn = $.hdb.getConnection();
		var rs = conn.executeQuery(query);
		conn.close();
		
		var res;
		
		if (rs.length > 0)
		{
			res = rs[0].Last;
		}else{
			res = -1;
		}
		
		return res;
	}catch(e){
		return -1;
	}
}

try{

	var params = $.request.body.asString();
	
	if (params !== undefined)
	{
		var id = GetLastKey();
		var myParams = JSON.parse(params);
		
		if(id > -1){
			id = id +1;
			var query = 'insert into "SBO_MSS_MOBILE"."EMPRESAS" values(?,?,?,?,?,?,?)';
			
	        var conn = $.db.getConnection();   
	        var pstmt = conn.prepareStatement(query);   
	        
	        pstmt.setInt(1, id);
	        pstmt.setString(2, myParams.description);
	        pstmt.setString(3, myParams.database);
	        pstmt.setString(4, myParams.username);
	        pstmt.setString(5, myParams.password);
	        pstmt.setString(6, myParams.state);
	        pstmt.setString(7, '');
	        pstmt.execute();
	        conn.commit();
	        conn.close();
			
			objType = "MessageSuccess";
			objResult = functions.CreateJSONMessage(id, "Success");
			
		}else{
		    objType = "MessageError";
			objResult = functions.CreateJSONMessage(-1, "Se produjo una excepción antes de realizar el registro.");
		}
	}else{
	    objType = "MessageError";
		objResult = functions.CreateJSONMessage(-1, "No ha ingresado los parámetros de entrada.");
	}
	
	objResponse = functions.CreateResponse(objType, objResult, 1);
	functions.DisplayJSON(objResponse,objType);
	
}catch(e){
    objType = "MessageError";
	objResult = functions.CreateJSONMessage(-9703000, e.message);
	objResponse = functions.CreateResponse(objType, objResult, 1);
	functions.DisplayJSON(objResponse, objType);
}