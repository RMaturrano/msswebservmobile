$.import("MSS_MOBILE.Functions", "Functions");
$.import("MSS_MOBILE.Constants","Constants");
var functions = $.MSS_MOBILE.Functions;
var Constants = $.MSS_MOBILE.Constants;
var objResponse;
var objResult;
var objType;
var query;
var conn;

function GetColumnsToUpdate(objBP){
    try{
        
        var filterCol = [];
        
        if(objBP.hasOwnProperty('MIGRADO')){
            filterCol.push('"MIGRADO" = \''+objBP.MIGRADO+'\' ');
        }
        
        if(objBP.hasOwnProperty('ACTUALIZADO')){
            filterCol.push('"ACTUALIZADO" = \''+objBP.ACTUALIZADO+'\' ');
        }
        
        if(objBP.hasOwnProperty('FINALIZADO')){
            filterCol.push('"FINALIZADO" = \''+objBP.FINALIZADO+'\' ');
        }
        
        if(objBP.hasOwnProperty('MENSAJE')){
            filterCol.push('"MENSAJE" = \''+objBP.MENSAJE+'\' ');
        }
        
        if(objBP.hasOwnProperty('CODIGOSAP')){
            filterCol.push('"CODIGOSAP" = '+objBP.CODIGOSAP+' ');
        }
        
        return filterCol.join(',');
        
    }catch(e){
        return undefined;
    }
}

function ActualizarCabecera(ordr, empresa, claveMovil){
    
    var updateResult = Constants.MESSAGE_SUCCESS;
    var columns;
    try{
        
        query = ' UPDATE '+Constants.BD_MOBILE+'."OCLG" SET  ';
        var where = ' where "CLAVEMOVIL" = \''+claveMovil+'\' AND "EMPRESA"  = ' + empresa;
        columns = GetColumnsToUpdate(JSON.parse(ordr));
        
        if(columns !== undefined && columns !== ''){
            query += columns;
            query += where;
            
            var pstmt = conn.prepareStatement(query);   
            pstmt.execute();
        }else{
            updateResult = 'No columns found.' + ' q ' + query + ' o ' + ordr + ' c ' + columns;
        }
                    
    }catch(e){
        updateResult = e.message;
    }
    
    return updateResult;
}

try{

	var params = $.request.body.asString();
	var empId = $.request.parameters.get('empId');
	var bpId = $.request.parameters.get('acId');
	
	if (params !== undefined && empId !== undefined && bpId !== undefined)
	{
	    conn = $.db.getConnection();
	    
	    //convertir los parámetros a JSON
		var objBusinessPartner = JSON.parse(params);
 
	    //realizar el registro en la BD de la cabecera del documento
	    var resCabe = ActualizarCabecera(objBusinessPartner, empId, bpId);
	        
	    if(resCabe === Constants.MESSAGE_SUCCESS){
            objType = Constants.SUCCESS_MESSAGE_RESPONSE;
	        objResult = functions.CreateJSONMessage(empId, Constants.MESSAGE_SUCCESS);
	        conn.commit();
        }else{
            conn.rollback();
            objType = Constants.ERROR_MESSAGE_RESPONSE;  
	        objResult = functions.CreateJSONMessage(-102, resCabe);
        }
	}else{
	    objType = Constants.ERROR_MESSAGE_RESPONSE;  
		objResult = functions.CreateJSONMessage(-100, "No ha ingresado los parámetros de entrada.");
	}
	
	objResponse = functions.CreateResponse(objType, objResult, 1);
	functions.DisplayJSON(objResponse,objType);
	
}catch(e){
    objType = Constants.ERROR_MESSAGE_RESPONSE;  
	objResult = functions.CreateJSONMessage(-9703000, e.message);
	objResponse = functions.CreateResponse(objType, objResult, 1);
	functions.DisplayJSON(objResponse, objType);
}finally{
    conn.close();
}