$.import("MSS_MOBILE.Functions", "Functions");
var functions = $.MSS_MOBILE.Functions;
var objResponse;
var objResult;
var objType;


try{
	
	if ($.request.body !== undefined)
	{
	    var params = $.request.body.asString();
		var myParams = JSON.parse(params);
		var dbname = functions.GetDataBase(myParams.empresaId);
		
		if(dbname !== null){
			var query = 'select count(*) as "Founded" from "' + dbname + '"."@MSSM_CVE" where "U_MSSM_USR" = \'' + myParams.usuario + '\'';
			var conn = $.hdb.getConnection();
    		var rs = conn.executeQuery(query);
    		conn.close();
    		
    		var res;
    		var pass;
    		var verificarId;
    		var idUnico = '';
    		var perfilActivo;
    		var usuarioActivo;
    		
    		if (rs.length > 0)
    		{
    			res = rs[0].Founded;
    			if(res > 0)
    			{
    			    query = 'select T0."U_MSSM_PWD",IFNULL(T1."U_MSSM_VAL", \'N\') AS "U_MSSM_VAL",IFNULL(T1."U_MSSM_IDU",\'\') as "IdUnico" ' +
    			             'from "' + dbname + '"."@MSSM_CVE" T0 ' +
    			             'LEFT JOIN "' + dbname + '"."@MSSM_EQP" T1 ON T0."U_MSSM_EQP" = T1."Code"' +
    			            'where T0."U_MSSM_USR" = \'' + myParams.usuario + '\'';
    			    conn = $.hdb.getConnection();
            		rs = conn.executeQuery(query);
            		conn.close();
            		
            		pass = rs[0].U_MSSM_PWD;
            		verificarId = rs[0].U_MSSM_VAL;
            		idUnico = rs[0].IdUnico;
            		
            		if(pass === myParams.password){
            		    
            		    query = 'select T0."Code" as "Codigo", '+
                            		'T0."Name" as "Nombre", ' +
                            		'T0."U_MSSM_USR" as "Usuario", ' +
                            		'T0."U_MSSM_PWD" as "Clave", ' +
                            		'T0."U_MSSM_PER" as "Perfil", ' +
                            		'IFNULL(T1."U_MSSM_HAB",\'N\') as "ActivoPerfil", ' +
                            		'IFNULL(T1."U_MSSM_SUP",\'N\') as "Supervisor", ' +
                            		'IFNULL(T1."U_MSSM_COB",\'N\') as "Cobrador", ' +
                            		'T3."Active" as "ActivoUsuario", ' +
                            		'X0."descripcion" as "NombreCompania", ' +
                            		'IFNULL(X0."MODO_REC_ORDR",\'02\') as "ModoRecOrden", ' +
                            		'IFNULL(X0."MODO_REC_ORCT",\'02\') as "ModoRecPago", ' +
                            		'IFNULL(X0."EDITAR_DCTO_ORDR",\'N\') as "EditarDctoOrdr",' +
                            		'X0."LINEAS_ORDR" AS "MaxLineas" ' +
                            		 ' from "' + dbname + '"."@MSSM_CVE" T0 ' +
                				' JOIN "' + dbname + '"."@MSSM_MTU" T1 ON T0."U_MSSM_PER" = T1."Code" ' +
                				' JOIN "SBO_MSS_MOBILE"."PERMISOS" T2 ON T1."Code" = T2."idPerfil" AND T2."idEmpresa" = ' +myParams.empresaId +
                				' JOIN "SBO_MSS_MOBILE"."EMPRESAS" X0 ON T2."idEmpresa" = X0."id" ' +
                				' JOIN "' + dbname + '"."OSLP" T3 ON T0."Code" = T3."SlpCode" ' +
                				'where T0."U_MSSM_USR" = \'' + myParams.usuario + '\'';
            		    conn = $.hdb.getConnection();
            		    rs = conn.executeQuery(query);
            		    conn.close();
            		    
            		    perfilActivo = rs[0].ActivoPerfil;
            		    usuarioActivo = rs[0].ActivoUsuario;
            		    
            		    if(usuarioActivo === 'Y'){
                		    if(verificarId === 'N'){
                		        if(perfilActivo === 'Y'){
                		            objType = "MessageSuccess";
                		        }else{
                		            objType = "MessageError";
                		            objResult = functions.CreateJSONMessage(-107, "El perfil asignado a este usuario se encuentra inactivo, contacte con el administrador.");
                		        }
                		    }else if(verificarId === 'Y' && (idUnico !== null && idUnico !== '' && idUnico !== undefined)){
                		        
                		        if(idUnico === myParams.idUnico){
                		            if(perfilActivo === 'Y'){
                		                objType = "MessageSuccess";
                    		        }else{
                    		            objType = "MessageError";
                		                objResult = functions.CreateJSONMessage(-107, "El perfil asignado a este usuario se encuentra inactivo, contacte con el administrador.");
                    		        }
                		        }else{
                		            objType = "MessageError";
                		            objResult = functions.CreateJSONMessage(-106, "El Id Unico de este dispositivo no corresponde al equipo que el usuario tiene asignado.");
                		        }
                		    }else if(verificarId === 'Y' && (idUnico === null || idUnico === '' || idUnico === undefined)){
                		        objType = "MessageError";
                		        objResult = functions.CreateJSONMessage(-105, "No se ha registrado el Id Unico del dispositivo móvil.");
                		    }
            		    }else{
            		        objType = "MessageError";
            		        objResult = functions.CreateJSONMessage(-108, "El usuario ingresado se encuentra inactivo, contacte con el administrador.");
            		    }
            		    
            		    if(objType === 'MessageSuccess'){
            		        objResult = JSON.stringify(rs[0]);
            		    }
            		    
            		}else{
            		    objType = "MessageError";
            		    objResult = functions.CreateJSONMessage(-104, "La clave ingresada no es válida.");
            		}
    			    
    			}else{
    			    objType = "MessageError";
    			    objResult = functions.CreateJSONMessage(-103, "El usuario ingresado no existe.");
    			}
    			
    		}else{
    		    objType = "MessageError";
    			objResult = functions.CreateJSONMessage(-102, "El usuario ingresado no existe.");
    		}
			
		}else{
		    objType = "MessageError";
			objResult = functions.CreateJSONMessage(-101, "No se halló la sociedad especificada.");
		}
		
	}else{
	    objType = "MessageError";
		objResult = functions.CreateJSONMessage(-100, "No ha ingresado los parámetros de entrada.");
	}
	
	objResponse = functions.CreateResponse(objType, objResult, 1);
	functions.DisplayJSON(objResponse);
	
}catch(e){
    objType = "MessageError";
	objResult = functions.CreateJSONMessage(-9703000, e.message + ' - params: ' + $.request.body.asString());
	objResponse = functions.CreateResponse(objType, objResult, 1);
	functions.DisplayJSON(objResponse, objType);
}


