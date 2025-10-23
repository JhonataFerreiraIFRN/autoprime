 const API_BASE_URL = "http://18.231.156.122:8080";

        // Função para Listar Carros (GET )
        document.getElementById('listarCarrosBtn').addEventListener('click', async () => {
            const listaCarrosDiv = document.getElementById('listaCarros');
            listaCarrosDiv.innerHTML = '<div class="text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Carregando...</span></div></div>';
            
            try {
                const response = await fetch(`${API_BASE_URL}/listarCarros`);
                
                if (!response.ok) {
                    throw new Error(`Erro na API. Status: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();

                // Converte o JSON de resposta para uma string formatada (conforme solicitado)
                const jsonString = JSON.stringify(data, null, 2);

                let htmlContent = `
                    <h6 class="mt-3">Dados JSON Brutos (Convertidos para String):</h6>
                    <pre class="bg-light p-3 border rounded">${jsonString}</pre>
                    <h6 class="mt-4">Tabela de Carros:</h6>
                    <table class="table table-striped table-hover">
                        <thead class="table-primary">
                            <tr>
                                <th>ID</th>
                                <th>Modelo</th>
                                <th>Preço</th>
                            </tr>
                        </thead>
                        <tbody>
                `;

                if (data && data.length > 0) {
                    data.forEach(carro => {
                        // Formatação de preço para Real brasileiro
                        const precoFormatado = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(carro.preco);
                        htmlContent += `
                            <tr>
                                <td>${carro.id}</td>
                                <td>${carro.modelo}</td>
                                <td>${precoFormatado}</td>
                            </tr>
                        `;
                    });
                } else {
                    htmlContent += '<tr><td colspan="3" class="text-center">Nenhum carro encontrado.</td></tr>';
                }

                htmlContent += '</tbody></table>';
                listaCarrosDiv.innerHTML = htmlContent;

            } catch (error) {
                listaCarrosDiv.innerHTML = `<div class="alert alert-danger" role="alert">Erro ao carregar carros: ${error.message}. **Verifique o console do navegador para o erro de CORS.**</div>`;
                console.error('Erro ao listar carros:', error);
            }
        });

        // Função para Adicionar Novo Carro (POST)
        document.getElementById('formNovoCarro').addEventListener('submit', async (e) => {
            e.preventDefault();
            const modelo = document.getElementById('modeloNovo').value;
            const preco = parseFloat(document.getElementById('precoNovo').value);
            const postResponseDiv = document.getElementById('postResponse');
            postResponseDiv.innerHTML = '<div class="text-center"><div class="spinner-border text-info" role="status"><span class="visually-hidden">Enviando...</span></div></div>';

            // O corpo da requisição está no formato JSON correto: {"modelo": "...", "preco": ...}
            const novoCarro = {
                modelo: modelo,
                preco: preco
            };

            try {
                const response = await fetch(`${API_BASE_URL}/novoCarros`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(novoCarro)
                });

                // Tenta ler o corpo da resposta como texto
                const responseText = await response.text();
                
                // Converte o JSON de envio para string para exibição
                const requestJsonString = JSON.stringify(novoCarro, null, 2);

                let responseHtml = `
                    <div class="alert ${response.ok ? 'alert-success' : 'alert-warning'}" role="alert">
                        <strong>Status:</strong> ${response.status} ${response.statusText}  

                        <strong>Corpo da Requisição (JSON para String):</strong>
                        <pre class="bg-white p-2 border rounded">${requestJsonString}</pre>
                        <strong>Resposta do Servidor (String):</strong>
                        <pre class="bg-white p-2 border rounded">${responseText}</pre>
                    </div>
                `;
                postResponseDiv.innerHTML = responseHtml;
                document.getElementById('formNovoCarro').reset(); // Limpa o formulário

            } catch (error) {
                postResponseDiv.innerHTML = `<div class="alert alert-danger" role="alert">Erro ao adicionar carro: ${error.message}. **Verifique o console do navegador para o erro de CORS.**</div>`;
                console.error('Erro ao adicionar carro:', error);
            }
        });

        // Função para Deletar Carro (DELETE)
        document.getElementById('formDeletarCarro').addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('idDeletar').value;
            const deleteResponseDiv = document.getElementById('deleteResponse');
            deleteResponseDiv.innerHTML = '<div class="text-center"><div class="spinner-border text-danger" role="status"><span class="visually-hidden">Deletando...</span></div></div>';

            try {
                // Assumindo que a API espera o ID como parâmetro de consulta
                const response = await fetch(`${API_BASE_URL}/deleteCarros?id=${id}`, {
                    method: 'DELETE'
                });

                const responseText = await response.text();

                let responseHtml = `
                    <div class="alert ${response.ok ? 'alert-success' : 'alert-warning'}" role="alert">
                        <strong>Status:</strong> ${response.status} ${response.statusText}  

                        <strong>ID Solicitado para Deletar:</strong> ${id}  

                        <strong>Resposta do Servidor (String):</strong>
                        <pre class="bg-white p-2 border rounded">${responseText}</pre>
                    </div>
                `;
                deleteResponseDiv.innerHTML = responseHtml;
                document.getElementById('formDeletarCarro').reset(); // Limpa o formulário

            } catch (error) {
                deleteResponseDiv.innerHTML = `<div class="alert alert-danger" role="alert">Erro ao deletar carro: ${error.message}. **Verifique o console do navegador para o erro de CORS.**</div>`;
                console.error('Erro ao deletar carro:', error);
            }
        });
