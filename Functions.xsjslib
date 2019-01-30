$.import("MSS_MOBILE.Constants","Constants");
var Constants = $.MSS_MOBILE.Constants;

function isEnabledLocalization(companyId){
    var res = 'N';
    try{
        var q = 'SELECT IFNULL("LOCALIZACION",\'N\') as "Res" FROM '+ 
	                    Constants.BD_MOBILE+'.EMPRESAS WHERE "id" = '+companyId;
        var c = $.hdb.getConnection();
    	var mRS = c.executeQuery(q);
    	c.close();
	    
	    if (mRS.length > 0)
    	{
    	    res = mRS[0].Res;
    	}
    }catch(e){
        res = 'N';
    }
    
    return res;
}

function GetDataBase(empID){
	try	{
		var query = 'select "base_datos" from "SBO_MSS_MOBILE"."EMPRESAS" where "id" = ' + empID;
		var conn = $.hdb.getConnection();
		var rs = conn.executeQuery(query);
		conn.close();
		
		var res;
		
		if (rs.length > 0)
		{
			res = rs[0].base_datos;
		}else{
			res = null;
		}
		
		return res;
	}catch(e){
		return null;
	}
}
function GetDirectorioSAP(bdSAP){
	try	{
		var query = 'select "BitmapPath" from "'+bdSAP+'"."OADP" ';
		var conn = $.hdb.getConnection();
		var rs = conn.executeQuery(query);
		conn.close();
		
		var res;
		
		if (rs.length > 0)
		{
			res = rs[0].BitmapPath;
		}else{
			res = null;
		}
		
		if(res === undefined || res === 'undefined' || res === ''){
		    res = null;
		}
		
		return res;
	}catch(e){
		return null;
	}
}

function GetCodAuto(database, userId){
    try{
        var query = 'select "U_MSSM_VEH" from '+database+'."@MSSM_CVE" ' +
                    ' where "U_MSSM_VEH" IS NOT NULL ' +
                    ' and "Code" = ' + userId;
        var conn = $.hdb.getConnection();
		var rs = conn.executeQuery(query);
		conn.close();
		
		var res;
		
		if (rs.length > 0)
		{
			res = rs[0].U_MSSM_VEH;
		}else{
			res = undefined;
		}
		
		return res;
        
    }catch(e){
        return undefined;
    }
}

function GetTableDocument(empID){
    
    try	{
		var query = ' select CASE WHEN IFNULL("EST_ORDR",\'02\') = \'01\' THEN \'ORDR\' ELSE \'ODRF\' END AS "Table"  ' +
                    '  from '+Constants.BD_MOBILE+'."EMPRESAS" where "id" = ' + empID;
		var conn = $.hdb.getConnection();
		var rs = conn.executeQuery(query);
		conn.close();
		
		var res;
		
		if (rs.length > 0)
		{
			res = rs[0].Table;
		}else{
			res = null;
		}
		
		return res;
	}catch(e){
		return null;
	}
}

function GetTableDocumentPayments(empID){
    
    try	{
		var query = ' select CASE WHEN IFNULL("EST_ORCT",\'02\') = \'01\' THEN \'ORCT\' ELSE \'OPDF\' END AS "Table"  ' +
                    '  from '+Constants.BD_MOBILE+'."EMPRESAS" where "id" = ' + empID;
		var conn = $.hdb.getConnection();
		var rs = conn.executeQuery(query);
		conn.close();
		
		var res;
		
		if (rs.length > 0)
		{
			res = rs[0].Table;
		}else{
			res = null;
		}
		
		return res;
	}catch(e){
		return null;
	}
}

function GetCurrentDate(){
    try{
        
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();
        
        if(dd<10) {
            dd = '0'+dd;
        } 
        
        if(mm<10) {
            mm = '0'+mm;
        } 
        
        today = yyyy + mm  + dd;
        return today;
        
    }catch(e){
        return '';
    }
}

function AddLogRegister(empresa, usuario, claveDoc, tipoDoc, message, source, tipo){
    var res = "";
    try{
        var query = 'insert into "SBO_MSS_MOBILE"."LOG_REGISTROS"  ' +
                    ' ("EMPRESAID","USUARIOID","CLAVEDOC","TIPODOC","FECHAREGISTRO","MESSAGE","SOURCE", "TIPO") ' +
                    ' values(?,?,?,?,CURRENT_DATE,?,?,?)';
			
        var conn = $.db.getConnection();   
        var pstmt = conn.prepareStatement(query);   
        
        pstmt.setInt(1, empresa);
        pstmt.setString(2, usuario);
        pstmt.setString(3, claveDoc);
        pstmt.setString(4, tipoDoc);
        pstmt.setString(5, message);
        pstmt.setString(6, source); //01 Desde la aplicacion => Base Movil, 02 Desde Base Movil => SAP
        pstmt.setString(7, tipo); //01 => ERROR
        
        pstmt.execute();
        conn.commit();
        conn.close();
        
    }catch(e){
        res = e.message;
        return res;
    }
    
    return res;
}

function DisplayJSON(Response, objType)
{
	$.response.contentType = "application/json";
	$.response.setBody(Response);
	
	switch(objType)
	{
		case "MessageSuccess":
	        $.response.status = $.net.http.OK;
	        break;
	    default:
	        $.response.status = $.net.http.OK;
	        break;
	}
}

function CreateJSONMessage(Code, Message)
{
	var ObjMessage;
	
	ObjMessage = '{"code": ' + Code + ', ';
	ObjMessage += '"message": {"lang": "en-us", ';
	ObjMessage += '"value": "' + Message + '"}}';
	
	return ObjMessage;
}

function CreateJSONObject(Code, Message, docEntry)
{
	var ObjMessage;
	
	ObjMessage = '{"code": ' + Code + ', ';
	ObjMessage += '"message": {"lang": "en-us", ';
	ObjMessage += '"value": ' + Message + '}}';
	
	return ObjMessage;
}

function CreateResponse(MessageType, ObjResponse, ObjCount)
{
	var jsonResponse;
	
	switch(MessageType)
	{
		case "MessageSuccess":
			jsonResponse = '{"ResponseStatus": "Success", ';
			jsonResponse += '"ResponseType": "Message", ';
			jsonResponse += '"ResponseCount": 1, ';
			jsonResponse += '"Response": ' + ObjResponse + '}';				
			break;
			
		case "ObjectSuccess":
			jsonResponse = '{"ResponseStatus": "Success", ';
			jsonResponse += '"ResponseType": "Object", ';
			jsonResponse += '"ResponseCount": ' + ObjCount + ', ';
			jsonResponse += '"Response": ' + ObjResponse + '}';
			break;
		
		case "MessageError":
			jsonResponse = '{"ResponseStatus": "Error", ';
			jsonResponse += '"ResponseType": "Message", ';
			jsonResponse += '"ResponseCount": 1, ';
			jsonResponse += '"Response": ' + ObjResponse + '}';				
			break;
			
		default:
			jsonResponse = '{"ResponseStatus": "Error", ';
			jsonResponse += '"ResponseType": "Message", ';
			jsonResponse += '"ResponseCount": 1, ';
			jsonResponse += '"Response": ' + ObjResponse + '}';				
			break;
	}
	
	return jsonResponse;
}


function ReplaceInvalidChars(stringWord){
    
    var newWord = stringWord;
    if(stringWord !== undefined){
        newWord = stringWord.replace(/[|&;$%@"<>()+,]/g, "");
    }
    
    return newWord.trim();
}

function CleanChars(stringWord){
    
    var newWord = stringWord;
    if(stringWord !== undefined){
        newWord = newWord.replace(/(\r\n|\n|\r)/gm,"");
    }
    
    return newWord.trim();
}