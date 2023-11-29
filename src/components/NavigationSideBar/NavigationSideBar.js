import "./navSideStyle.css"

export default function NavigationSideBar() {
    return (
        <div className="offcanvas offcanvas-start show" tabindex="-1" id="offcanvas" aria-labelledby="offcanvasLabel">
            <div className="offcanvas-body">
                <h5 className="offcanvas-title" id="offcanvasLabel">Mais utilizados</h5>
                <ul>
                    <li><a href='#'>Geral</a></li>
                    <li><a href='#'>Classes</a></li>
                    <li><a href='#'>PDVs</a></li>
                    <li><a href='#'>Diários</a></li>
                    <li><a href='#'>Numerados</a></li>
                    <li><a href='#'>Cancelados</a></li>
                </ul>
                <h5 className="offcanvas-title" id="offcanvasLabel">Rel. Analíticos</h5>
                <ul>
                    <li><a href='#'>Comissários</a></li>
                    <li><a href='#'>Site Detalhados</a></li>
                    <li><a href='#'>Detalhados</a></li>
                </ul>
                <h5 className="offcanvas-title" id="offcanvasLabel">Analytics</h5>
                <ul>
                    <li><a href='#'>Visualização x Vendas Web</a></li>
                </ul>
                <h5 className="offcanvas-title" id="offcanvasLabel">Sangrias</h5>
                <ul>
                    <li><a href='#'>Sangrias</a></li>
                    <li><a href='#'>Sangrias Comprovantes</a></li>
                </ul>
                <h5 className="offcanvas-title" id="offcanvasLabel">Administrativo</h5>
                <ul>
                    <li><a href='#'>Gestão de Lotes</a></li>
                </ul>
            </div>
        </div>
    )
}